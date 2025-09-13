"use client";

// src/components/AvatarDisplay.tsx
import { Card, CardContent } from "../ui/components/card";
import { useUserStore } from "../state/userStore";
import { getKarmaColor, calculateKarmaBonus } from "../utils/karmaLogic";
import { motion } from "framer-motion";

// Why: keep math explicit & tunable for progress bar semantics.
const MAX_KARMA = 100;

export const AvatarDisplay = () => {
  const user = useUserStore((state) => state.user);
  if (!user) return null;

  const karma = Math.max(0, Number(user.karma) || 0);
  const auraColor = getKarmaColor(karma);
  const karmaTier = calculateKarmaBonus(karma);

  // Clamp [0..1], show as percent for width.
  const progress = Math.min(karma / MAX_KARMA, 1);
  const progressPct = `${(progress * 100).toFixed(0)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-sm w-full"
    >
      <Card className="bg-gradient-to-br from-black via-gray-900 to-purple-950 shadow-xl border-2 border-purple-700 rounded-2xl">
        <CardContent className="p-5 text-white space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{user.name ?? "Adventurer"}</h2>
            <span className="text-sm bg-purple-800 px-2 py-1 rounded-full">
              {(user.role ?? "user").toString().toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Karma: {karma}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: auraColor }}
            >
              {karmaTier}
            </span>
          </div>

          {user.activeVision && (
            <div className="text-xs italic text-gray-400">
              🌠 Current Vision: {user.activeVision.title}
            </div>
          )}

          <div
            className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={MAX_KARMA}
            aria-valuenow={Math.min(karma, MAX_KARMA)}
            aria-label="Karma progress"
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: auraColor, width: progressPct }}
              initial={{ width: 0 }}
              animate={{ width: progressPct }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default useUserStore;
