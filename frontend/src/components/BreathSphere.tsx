// Pulsing Breath Sphere. Drives an outer glow + inner orb scaling
// across the breath phases. Phase changes are commanded by parent.
// We render purely with Reanimated + LinearGradient for portability.

import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import type { BreathPhase } from "@/src/data/breathwork";

type Props = {
  phase: BreathPhase;
  duration: number; // seconds for this phase
  accent: string;
  size?: number;
};

export function BreathSphere({ phase, duration, accent, size = 280 }: Props) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.3);

  useEffect(() => {
    const ms = Math.max(200, duration * 1000);
    if (phase === "inhale") {
      scale.value = withTiming(1.6, {
        duration: ms,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      glow.value = withTiming(0.85, { duration: ms });
    } else if (phase === "hold") {
      scale.value = withTiming(1.6, { duration: ms, easing: Easing.linear });
      glow.value = withTiming(0.95, { duration: ms });
    } else if (phase === "exhale") {
      scale.value = withTiming(1, {
        duration: ms,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      glow.value = withTiming(0.3, { duration: ms });
    } else {
      // hold_empty
      scale.value = withTiming(1, { duration: ms, easing: Easing.linear });
      glow.value = withTiming(0.18, { duration: ms });
    }
  }, [phase, duration, scale, glow]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.85,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.35 }],
    opacity: glow.value,
  }));

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 1.8 }],
    opacity: glow.value * 0.4,
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size, pointerEvents: "none" }]}>
      <Animated.View style={[styles.layer, haloStyle]}>
        <LinearGradient
          colors={[accent, "rgba(0,0,0,0)"]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={[styles.layerInner, { borderRadius: size / 2 }]}
        />
      </Animated.View>
      <Animated.View style={[styles.layer, glowStyle]}>
        <LinearGradient
          colors={[accent, "rgba(0,0,0,0)"]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          style={[styles.layerInner, { borderRadius: size / 2 }]}
        />
      </Animated.View>
      <Animated.View style={[styles.layer, orbStyle]}>
        <LinearGradient
          colors={["#FFFFFF", accent, "rgba(0,0,0,0)"]}
          start={{ x: 0.35, y: 0.3 }}
          end={{ x: 0.8, y: 1 }}
          style={[
            styles.layerInner,
            {
              borderRadius: size / 2,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.4)",
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  layerInner: {
    width: "100%",
    height: "100%",
  },
});
