import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { SkillsetCopilot, DefaultSkills, Plan, Outcome } from "@/copilot/skillsetCopilot";

export default function SkillCopilotScreen() {
  const copilot = useMemo(() => new SkillsetCopilot(DefaultSkills), []);
  const [goal, setGoal] = useState("Ship preview build with GitHub login");
  const [daily, setDaily] = useState("45");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [minutesNow, setMinutesNow] = useState("30");

  function createPlan() {
    const p = copilot.generatePlan({
      userId: "me",
      goal,
      dailyMinutes: Number.parseInt(daily || "30", 10),
      currentGaps: [
        { skillId: "deeplinks", current: "none", target: "intermediate", importance: 3 },
        { skillId: "supabase-auth", current: "basic", target: "intermediate", importance: 3 },
        { skillId: "ci", current: "none", target: "basic", importance: 2 },
      ],
    });
    setPlan(p);
  }

  function act(outcome: Outcome) {
    if (!plan) return;
    const next = copilot.nextAction(plan, Number(minutesNow || "30"));
    if (!next) return;
    const updated = copilot.recordOutcome(structuredClone(plan), next.id, outcome, `user marked ${outcome}`);
    setPlan(updated);
  }

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Skillset Copilot</Text>

      <Text>Goal</Text>
      <TextInput value={goal} onChangeText={setGoal} placeholder="What are we trying to achieve?" style={{ borderWidth: 1, padding: 8 }} />
      <Text>Daily minutes</Text>
      <TextInput value={daily} onChangeText={setDaily} keyboardType="numeric" style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Generate Plan" onPress={createPlan} />

      {plan && (
        <>
          <Text style={{ marginTop: 12, fontWeight: "600" }}>Next best action (time now)</Text>
          <TextInput value={minutesNow} onChangeText={setMinutesNow} keyboardType="numeric" style={{ borderWidth: 1, padding: 8 }} />
          <Text style={{ marginVertical: 6 }}>
            {(() => {
              const n = copilot.nextAction(plan, Number(minutesNow || "30"));
              return n ? `• ${n.title} — ${n.durationMin} min` : "No action fits your time window.";
            })()}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button title="Done" onPress={() => act("done")} />
            <Button title="Blocked" onPress={() => act("blocked")} />
            <Button title="Skipped" onPress={() => act("skipped")} />
          </View>

          <Text style={{ marginTop: 16, fontWeight: "600" }}>Plan items</Text>
          <FlatList
            data={plan.items}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Text style={{ marginVertical: 4 }}>
                {item.status === "done" ? "✅" : "🟦"} {item.title} · {item.kind} · {item.durationMin}m · w={item.weight.toFixed(2)}
              </Text>
            )}
          />
        </>
      )}
    </View>
  );
}
