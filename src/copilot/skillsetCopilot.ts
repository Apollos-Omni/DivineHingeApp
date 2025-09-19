// Lightweight "skill copilot" engine for DivineHingeApp.
// - Builds a learning plan from a goal + current skills + time budget
// - Surfaces the next best action
// - Lets you record outcomes and adapt the plan
// - (Optional) syncs to Supabase tables if provided

export type SkillLevel = "none" | "basic" | "intermediate" | "advanced";
export type Importance = 1 | 2 | 3;

export type Skill = {
  id: string;
  name: string;
  tags: string[];
  prereqs?: string[]; // skill IDs
};

export type SkillGap = {
  skillId: string;
  current: SkillLevel;
  target: SkillLevel;
  importance: Importance; // 1=nice, 2=useful, 3=critical
};

export type PlanItemKind = "read" | "watch" | "practice" | "build";
export type Outcome = "done" | "blocked" | "skipped";

export type PlanItem = {
  id: string;
  skillId: string;
  title: string;
  kind: PlanItemKind;
  durationMin: number;
  link?: string;
  weight: number; // priority score (auto-tunes)
  status: "pending" | "in_progress" | "done";
  notes?: string;
};

export type Plan = {
  userId: string;
  goal: string;
  version: number;
  createdAt: string;
  dailyMinutes: number;
  targetDate?: string; // ISO
  items: PlanItem[];
};

export type GenerateInput = {
  userId: string;
  goal: string;
  dailyMinutes: number; // realistic daily availability
  targetDate?: string;  // optional finish target
  currentGaps: SkillGap[];
};

export class SkillsetCopilot {
  constructor(private library: Skill[]) {}

  /** Build a plan from skill gaps + constraints */
  generatePlan(input: GenerateInput): Plan {
    const { userId, goal, dailyMinutes, targetDate, currentGaps } = input;
    const createdAt = new Date().toISOString();

    // Expand prereqs: if a gap requires an unmet prereq, insert a basic gap for it.
    const unmet = new Set(currentGaps.map(g => g.skillId));
    const prereqGaps: SkillGap[] = [];
    for (const gap of currentGaps) {
      const skill = this.library.find(s => s.id === gap.skillId);
      if (!skill?.prereqs) continue;
      for (const pre of skill.prereqs) {
        if (!unmet.has(pre)) {
          prereqGaps.push({
            skillId: pre,
            current: "none",
            target: "basic",
            importance: 3, // prereqs are critical
          });
          unmet.add(pre);
        }
      }
    }

    const allGaps = dedupeGaps([...currentGaps, ...prereqGaps]);

    // Turn each gap into a few micro-actions (15–45 min apiece).
    const items: PlanItem[] = [];
    for (const gap of allGaps) {
      const skill = this.requireSkill(gap.skillId);
      const tasks = scaffoldTasksForGap(skill, gap);
      for (const t of tasks) {
        items.push({
          id: `pi_${skill.id}_${hash(t.title)}`,
          skillId: skill.id,
          title: t.title,
          kind: t.kind,
          durationMin: clamp(t.durationMin, 15, 60),
          link: t.link,
          weight: baseWeight(gap.importance, gap.target),
          status: "pending",
        });
      }
    }

    // Sort by weight, then shorter-first to reduce friction.
    items.sort((a, b) => b.weight - a.weight || a.durationMin - b.durationMin);

    return {
      userId,
      goal,
      version: 1,
      createdAt,
      dailyMinutes,
      targetDate,
      items,
    };
  }

  /** Return the highest-value next action, respecting time budget and unfinished work */
  nextAction(plan: Plan, minutesAvailable: number): PlanItem | null {
    // Prefer an in-progress item that fits; else, best pending item that fits.
    const fit = (p: PlanItem) => p.status !== "done" && p.durationMin <= minutesAvailable;
    const inProgress = plan.items.find(p => p.status === "in_progress" && fit(p));
    if (inProgress) return inProgress;
    const candidate = [...plan.items]
      .filter(fit)
      .sort((a, b) => b.weight - a.weight || a.durationMin - b.durationMin)[0];
    return candidate || null;
  }

  /** Record the outcome for a plan item and adapt weights */
  recordOutcome(plan: Plan, itemId: string, outcome: Outcome, notes?: string): Plan {
    const idx = plan.items.findIndex(p => p.id === itemId);
    if (idx < 0) return plan;

    const item = plan.items[idx];
    if (item) {
      item.notes = concatNotes(item.notes, notes);
    }

    // Simple adaptive weighting:
    // - done: decrease weight slightly (progress)
    // - blocked: increase weight of its direct prereq(s) and add a remediation task
    // - skipped: small decay to avoid permanent top-pinning
    if (item) {
      if (outcome === "done") {
        item.status = "done";
        item.weight *= 0.7;
      } else if (outcome === "blocked") {
        item.status = "pending";
        item.weight *= 0.9;
        // Insert a remediation micro-task ahead of it
        const remediation: PlanItem = {
          id: `pi_fix_${item.id}_${Math.random().toString(36).slice(2)}`,
          skillId: item.skillId,
          title: `Unblock: clarify pre-req for "${item.title}"`,
          kind: "read",
          durationMin: Math.min(20, item.durationMin),
          weight: item.weight + 0.5,
          status: "pending",
        };
        plan.items.splice(idx, 0, remediation);
      } else if (outcome === "skipped") {
        item.status = "pending";
        item.weight *= 0.95;
      }

      // Keep weights within sane bounds
      item.weight = clamp(item.weight, 0.1, 10);
    }
    return plan;
  }

  /** Optional: persist to Supabase tables (see SQL below) */
  async syncToSupabase(client: {
    from: (t: string) => {
      upsert: (v: any, opt?: any) => Promise<{ error: any }>;
    };
  }, plan: Plan): Promise<void> {
    const { error: e1 } = await client.from("skill_plans").upsert({
      user_id: plan.userId,
      goal: plan.goal,
      version: plan.version,
      created_at: plan.createdAt,
      daily_minutes: plan.dailyMinutes,
      target_date: plan.targetDate ?? null,
    });
    if (e1) throw e1;

    // Upsert items
    const rows = plan.items.map(i => ({
      id: i.id,
      user_id: plan.userId,
      skill_id: i.skillId,
      title: i.title,
      kind: i.kind,
      duration_min: i.durationMin,
      link: i.link ?? null,
      weight: i.weight,
      status: i.status,
      notes: i.notes ?? null,
    }));

    const { error: e2 } = await client.from("skill_plan_items").upsert(rows, { onConflict: "id" });
    if (e2) throw e2;
  }

  private requireSkill(id: string): Skill {
    const s = this.library.find(sk => sk.id === id);
    if (!s) throw new Error(`Unknown skill: ${id}`);
    return s;
  }
}

/* ---------- Helpers & scaffolding ---------- */

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}
function baseWeight(importance: Importance, target: SkillLevel): number {
  const imp = { 1: 1, 2: 1.5, 3: 2 }[importance];
  const tgt = { none: 0.8, basic: 1.0, intermediate: 1.4, advanced: 1.8 }[target];
  return imp * tgt;
}
function concatNotes(a?: string, b?: string) {
  if (!b) return a;
  if (!a) return b;
  return `${a}\n${new Date().toISOString()}: ${b}`;
}

type ScaffTask = { title: string; kind: PlanItemKind; durationMin: number; link?: string };

// Minimal curated scaffolding for a DivineHinge mobile stack.
// Add/modify to fit your product’s internal learning materials or docs.
function scaffoldTasksForGap(skill: Skill, gap: SkillGap): ScaffTask[] {
  const tasks: ScaffTask[] = [];
  const name = skill.name;

  const micro = (title: string, kind: PlanItemKind, dur: number, link?: string) =>
    tasks.push({ title, kind, durationMin: dur, link });

  // Cold start: ensure "basic" intro before deeper levels
  if (gap.current === "none") {
    micro(`Intro to ${name}`, "read", 20);
    micro(`${name}: quick practice`, "practice", 25);
  }
  if (gap.target === "intermediate" || gap.target === "advanced") {
    micro(`${name}: build a tiny demo`, "build", 40);
  }
  if (gap.target === "advanced") {
    micro(`${name}: edge cases & performance notes`, "read", 25);
  }

  // Sprinkle domain-specific defaults by tag
  if (skill.tags.includes("react-native")) {
    micro(`RN ${name}: run on device/emulator`, "practice", 30);
  }
  if (skill.tags.includes("expo")) {
    micro(`Expo ${name}: config + dev client sanity`, "read", 20);
  }
  if (skill.tags.includes("supabase")) {
    micro(`Supabase ${name}: policy + RLS check`, "read", 20);
  }

  return tasks;
}

/* ---------- A small default skill library ---------- */

export const DefaultSkills: Skill[] = [
  { id: "ts", name: "TypeScript Essentials", tags: ["language"], prereqs: [] },
  { id: "rn", name: "React Native Basics", tags: ["react-native"], prereqs: ["ts"] },
  { id: "expo", name: "Expo Tooling & Config", tags: ["expo"], prereqs: ["rn"] },
  { id: "deeplinks", name: "Deep Linking & Auth Flows", tags: ["expo", "react-native"], prereqs: ["expo"] },
  { id: "supabase-auth", name: "Supabase Auth (PKCE)", tags: ["supabase"], prereqs: ["deeplinks"] },
  { id: "supabase-db", name: "Supabase DB & RLS", tags: ["supabase"], prereqs: ["ts"] },
  { id: "ci", name: "CI/CD with EAS & Actions", tags: ["expo"], prereqs: ["expo"] },
];

function dedupeGaps(gaps: SkillGap[]): SkillGap[] {
  // Deduplicate by skillId, keeping the gap with the highest target and importance
  const map = new Map<string, SkillGap>();
  for (const gap of gaps) {
    const existing = map.get(gap.skillId);
    if (!existing) {
      map.set(gap.skillId, gap);
    } else {
      // Prefer higher target level, then higher importance
      const levels = { none: 0, basic: 1, intermediate: 2, advanced: 3 };
      if (
        levels[gap.target] > levels[existing.target] ||
        (levels[gap.target] === levels[existing.target] && gap.importance > existing.importance)
      ) {
        map.set(gap.skillId, gap);
      }
    }
  }
  return Array.from(map.values());
}
/* Example usage:
const copilot = new SkillsetCopilot(DefaultSkills);
const plan = copilot.generatePlan({
  userId: authUser.id,
  goal: "Ship divinehinge preview build with GitHub login",
  dailyMinutes: 45,
  currentGaps: [
    { skillId: "deeplinks", current: "none", target: "intermediate", importance: 3 },
    { skillId: "supabase-auth", current: "basic", target: "intermediate", importance: 3 },
    { skillId: "ci", current: "none", target: "basic", importance: 2 },
  ],
});
const next = copilot.nextAction(plan, 30);
*/
