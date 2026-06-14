// Ambient gradient backdrop. Two layered LinearGradient stacks +
// soft animated orbs give the "dynamic mesh" feel without Skia.
// Pass a 3-stop gradient (void -> mid -> accent) and we render a
// vertical gradient + two diagonal radial-ish orb overlays.

import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  colors: string[]; // 3 stops
  accent?: string;
  intensity?: number; // 0-1
};

export function AmbientBackground({
  colors,
  accent,
  intensity = 1,
}: Props) {
  const t1 = useSharedValue(0);
  const t2 = useSharedValue(0);

  useEffect(() => {
    t1.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    t2.value = withRepeat(
      withTiming(1, { duration: 22000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [t1, t2]);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: -120 + t1.value * 240 },
      { translateY: -80 + t1.value * 160 },
      { scale: 1 + t1.value * 0.25 },
    ],
    opacity: 0.55 * intensity,
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: 120 - t2.value * 220 },
      { translateY: 100 - t2.value * 200 },
      { scale: 1.1 + (1 - t2.value) * 0.3 },
    ],
    opacity: 0.4 * intensity,
  }));

  const safeColors = (colors.length >= 2 ? colors : ["#050505", "#050505"]) as [
    string,
    string,
    ...string[],
  ];
  const accentColor = accent ?? safeColors[safeColors.length - 1];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={safeColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      <Animated.View style={[styles.orb, orb1Style]}>
        <LinearGradient
          colors={[accentColor, "rgba(0,0,0,0)"]}
          style={styles.orbGrad}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb2, orb2Style]}>
        <LinearGradient
          colors={[safeColors[Math.min(2, safeColors.length - 1)], "rgba(0,0,0,0)"]}
          style={styles.orbGrad}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0, y: 0 }}
        />
      </Animated.View>
      {/* Vignette */}
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.55)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#050505",
    overflow: "hidden",
    pointerEvents: "none",
  },
  orb: {
    position: "absolute",
    top: -160,
    left: -80,
    width: 520,
    height: 520,
    borderRadius: 260,
  },
  orb2: {
    top: undefined,
    bottom: -200,
    left: undefined,
    right: -120,
  },
  orbGrad: {
    flex: 1,
    borderRadius: 260,
  },
});
