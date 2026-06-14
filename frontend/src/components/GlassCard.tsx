// Glassmorphism card. Wraps children inside an expo-blur view with
// translucent fill and ultra-fine white border. Falls back gracefully
// on web (BlurView still renders a tint).

import { BlurView } from "expo-blur";
import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
  intensity?: number;
  radius?: number;
  padding?: number;
  style?: ViewStyle | ViewStyle[];
  borderColor?: string;
  bg?: string;
  testID?: string;
};

export function GlassCard({
  children,
  intensity = 60,
  radius = 24,
  padding = 20,
  style,
  borderColor = "rgba(255,255,255,0.15)",
  bg = "rgba(255,255,255,0.04)",
  testID,
}: Props) {
  return (
    <View
      testID={testID}
      style={[
        styles.shadowWrap,
        { borderRadius: radius },
        style as ViewStyle,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[
          styles.blur,
          {
            borderRadius: radius,
            borderColor,
            backgroundColor: bg,
            padding,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 32,
    elevation: 12,
  },
  blur: {
    overflow: "hidden",
    borderWidth: 1,
  },
});
