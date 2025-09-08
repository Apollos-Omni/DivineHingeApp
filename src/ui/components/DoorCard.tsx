import React from 'react';
import { Pressable, View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import GlassCard from './common/GlassCard';
import { colors, spacing } from '../../theme/tokens';

type Status = 'locked' | 'unlocked' | 'ajar';

type Props = {
  name?: string;
  status?: Status;
  onPress?: () => void;
};

const DoorCard: React.FC<Props> = ({ name = 'Front Door', status = 'locked', onPress }) => {
  const color =
    status === 'locked' ? colors.danger :
    status === 'unlocked' ? colors.accent :
    colors.warning;

  const scale = useSharedValue(1);
  const openAnim = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const doorStyle = useAnimatedStyle(() => {
    const deg = -openAnim.value * 70;
    return { transform: [{ perspective: 600 }, { rotateY: `${deg}deg` }] };
  });

  const onTap = () => {
    scale.value = withTiming(0.97, { duration: 80, easing: Easing.out(Easing.cubic) }, () => {
      scale.value = withTiming(1, { duration: 80 });
    });
    openAnim.value = withTiming(openAnim.value > 0.5 ? 0 : 1, { duration: 220, easing: Easing.out(Easing.cubic) });
    onPress?.();
  };

  return (
    <Pressable onPress={onTap} style={{ width: '100%' }}>
      <Animated.View style={[{ marginBottom: spacing.lg }, rStyle]}>
        <GlassCard>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 8 }} />
            <Text style={{ color: colors.text, fontWeight: '700' }}>{name}</Text>
          </View>

          <Animated.View
            style={[{ marginTop: 10, width: 60, height: 6, backgroundColor: colors.border, borderRadius: 3 }, doorStyle]}
          />

          <Text style={{ color: colors.muted, marginTop: 6 }}>Status: {status}</Text>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
};

export default DoorCard;
export { DoorCard };
