// Breath intercept (prerequisite + audio matrix + long-press to begin).
// Used for breathwork sessions. After haptic confirm, navigate to player.

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AmbientBackground } from "@/src/components/AmbientBackground";
import { AudioMatrix } from "@/src/components/AudioMatrix";
import { GlassCard } from "@/src/components/GlassCard";
import { useApp } from "@/src/context/AppContext";
import { getBreathSession } from "@/src/data/breathwork";
import { isRTL, t } from "@/src/data/i18n";

const HOLD_MS = 1200;

export default function BreathIntercept() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const { locale } = useApp();
  const rtl = isRTL(locale);
  const sessionId = params.sessionId ?? "bw-b-act-wake";
  const session = getBreathSession(sessionId);

  const [holding, setHolding] = useState(false);
  const progress = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startHold = () => {
    Haptics.selectionAsync();
    setHolding(true);
    progress.value = withTiming(1, {
      duration: HOLD_MS,
      easing: Easing.out(Easing.cubic),
    });
    timeoutRef.current = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      router.replace({
        pathname: "/breath/player",
        params: { sessionId },
      });
    }, HOLD_MS);
  };
  const endHold = () => {
    setHolding(false);
    progress.value = withTiming(0, { duration: 250 });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!session) {
    return (
      <View style={styles.root}>
        <Text style={{ color: "#FFFFFF", padding: 40 }}>Session not found.</Text>
      </View>
    );
  }

  const title = locale === "fa" ? session.title_fa : session.title_en;
  const desc = locale === "fa" ? session.description_fa : session.description_en;
  const cat = locale === "fa" ? session.category_fa : session.category_en;

  return (
    <View style={styles.root}>
      <AmbientBackground
        colors={["#050505", "#0F1A28", "#1F324A"]}
        accent="#7BD5F5"
      />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View
          style={[
            styles.topRow,
            { flexDirection: rtl ? "row-reverse" : "row" },
          ]}
        >
          <TouchableOpacity
            testID="intercept-back"
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Feather
              name={rtl ? "chevron-right" : "chevron-left"}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: 28 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 6, alignItems: rtl ? "flex-end" : "flex-start" }}>
            <Text style={[styles.eyebrow, { textAlign: rtl ? "right" : "left" }]}>
              {cat}
            </Text>
            <Text style={[styles.h1, { textAlign: rtl ? "right" : "left" }]}>
              {title}
            </Text>
            <Text style={[styles.sub, { textAlign: rtl ? "right" : "left" }]}>
              {desc}
            </Text>
          </View>

          <GlassCard padding={20} radius={22} style={{ marginTop: 22 }} testID="prereq-card">
            <Text
              style={[
                styles.prereqHead,
                { textAlign: rtl ? "right" : "left" },
              ]}
            >
              {t(locale, "prereq_title")}
            </Text>
            {[
              t(locale, "prereq_1"),
              t(locale, "prereq_2"),
              t(locale, "prereq_3"),
              t(locale, "prereq_4"),
            ].map((line, idx) => (
              <View
                key={idx}
                style={[
                  styles.prereqRow,
                  { flexDirection: rtl ? "row-reverse" : "row" },
                ]}
              >
                <View style={styles.dot} />
                <Text
                  style={[
                    styles.prereqText,
                    { textAlign: rtl ? "right" : "left" },
                  ]}
                >
                  {line}
                </Text>
              </View>
            ))}
          </GlassCard>

          <View style={{ marginTop: 18 }}>
            <AudioMatrix testIDPrefix="intercept-audio" />
          </View>
        </ScrollView>

        {/* Bottom long-press confirm */}
        <View style={[styles.confirmWrap, { paddingBottom: insets.bottom + 18 }]}>
          <Pressable
            testID="long-press-begin"
            onPressIn={startHold}
            onPressOut={endHold}
            style={[styles.confirm, holding && styles.confirmActive]}
          >
            <Animated.View style={[styles.confirmFill, fillStyle]} />
            <View style={styles.confirmContent}>
              <Feather
                name={holding ? "circle" : "play"}
                size={18}
                color="#050505"
              />
              <Text style={styles.confirmText}>
                {holding
                  ? t(locale, "release_to_start")
                  : t(locale, "hold_to_begin")}
              </Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  topRow: {
    paddingHorizontal: 16,
    paddingTop: 6,
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  scroll: { paddingHorizontal: 24, paddingTop: 16 },
  eyebrow: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  h1: { color: "#FFFFFF", fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.5 },
  sub: { color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 22 },
  prereqHead: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 12,
  },
  prereqRow: { alignItems: "center", gap: 12, paddingVertical: 8 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7BD5F5",
  },
  prereqText: { color: "rgba(255,255,255,0.85)", fontSize: 15, flex: 1 },
  confirmWrap: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  confirm: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmActive: {
    transform: [{ scale: 0.985 }],
  },
  confirmFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#7BD5F5",
  },
  confirmContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 1,
  },
  confirmText: { color: "#050505", fontWeight: "700", fontSize: 15, letterSpacing: 0.4 },
});
