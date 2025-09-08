import { Card, CardContent } from '../ui/components/card';
import { useUserStore } from '../state/userStore';
import { getKarmaColor, calculateKarmaBonus } from '../utils/karmaLogic';
import { motion } from 'framer-motion';

export const AvatarDisplay = () => {
  const user = useUserStore((state) => state.user);
  if (!user) return null;

  const karma = user.karma || 0;
  const karmaTier = calculateKarmaBonus(karma);
  const auraColor = getKarmaColor(karma);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-sm w-full"
    >
      <Card className="bg-gradient-to-br from-black via-gray-900 to-purple-950 shadow-xl border-2 border-purple-700 rounded-2xl">
        <CardContent className="p-5 text-white space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <span className="text-sm bg-purple-800 px-2 py-1 rounded-full">
              {user.role.toUpperCase()}
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

          <div className="w-full h-2 bg-gray-800 rounded-full">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(karma / 100, 100)}%`,
                backgroundColor: auraColor,
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
