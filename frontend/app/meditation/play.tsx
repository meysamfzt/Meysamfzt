// Meditation play. Single screen with two stages:
//   1) intercept: prereq + audio matrix + long-press to begin
//   2) player: ambient timer + affirmation ticker + mentor greeting (first session)

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { BreathSphere } from "@/src/components/BreathSphere";
import { GlassCard } from "@/src/components/GlassCard";
import { MentorGreeting } from "@/src/components/MentorGreeting";
import { useApp } from "@/src/context/AppContext";
import {
  getBranch,
  getLevel,
  getSession,
  getTopic,
} from "@/src/data/branches";
import { isRTL, t } from "@/src/data/i18n";

const HOLD_MS = 1200;

export default function MeditationPlay() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    branch?: string;
    level?: string;
    topic?: string;
    session?: string;
  }>();
  const { locale, audio, addHistory, mentorsMet, markMentorMet } = useApp();
  const rtl = isRTL(locale);

  const branch = getBranch(params.branch ?? "");
  const level = getLevel(params.branch ?? "", params.level ?? "");
  const topic = getTopic(params.branch ?? "", params.level ?? "", params.topic ?? "");
  const session = getSession(
    params.branch ?? "",
    params.level ?? "",
    params.topic ?? "",
    params.session ?? "",
  );

  const [stage, setStage] = useState<"intercept" | "player">("intercept");
  const [holding, setHolding] = useState(false);
  const progress = useSharedValue(0);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Player state
  const [elapsed, setElapsed] = useState(0); // seconds
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [affIdx, setAffIdx] = useState(0);
  const [showMentor, setShowMentor] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSec = (session?.duration_min ?? 10) * 60;

  // Show mentor on first session of branch (only once, after intercept).
  useEffect(() => {
    if (!branch) return;
    if (stage === "player" && !mentorsMet.includes(branch.id)) {
      setShowMentor(true);
      void markMentorMet(branch.id);
    }
  }, [stage, branch, mentorsMet, markMentorMet]);

  // Ticker
  useEffect(() => {
    if (stage !== "player" || paused || done) return;
    tickRef.current = setInterval(() => {
      setElapsed((e) => {
        const nxt = e + 1;
        if (nxt >= totalSec) {
          finish();
          return totalSec;
        }
        return nxt;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, paused, done, totalSec]);

  // Affirmation cycling every (totalSec / affirmations.length) seconds
  useEffect(() => {
    if (!session) return;
    const n = session.affirmations_en.length;
    if (n === 0) return;
    const interval = Math.max(20, Math.floor(totalSec / n));
    const idx = Math.min(n - 1, Math.floor(elapsed / interval));
    if (idx !== affIdx) setAffIdx(idx);
  }, [elapsed, session, totalSec, affIdx]);

  const finish = async () => {
    if (done || !session || !branch || !topic || !level) return;
    setDone(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addHistory({
      kind: "meditation",
      refId: `${branch.id}/${level.id}/${topic.id}/${session.id}`,
      title_en: `${branch.title_en} · ${session.title_en}`,
      title_fa: `${branch.title_fa} · ${session.title_fa}`,
      duration_min: session.duration_min,
    });
  };

  const startHold = () => {
    Haptics.selectionAsync();
    setHolding(true);
    progress.value = withTiming(1, {
      duration: HOLD_MS,
      easing: Easing.out(Easing.cubic),
    });
    holdRef.current = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setStage("player");
    }, HOLD_MS);
  };
  const endHold = () => {
    setHolding(false);
    progress.value = withTiming(0, { duration: 250 });
    if (holdRef.current) clearTimeout(holdRef.current);
  };

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const remaining = useMemo(() => Math.max(0, totalSec - elapsed), [totalSec, elapsed]);
  const mm = Math.floor(remaining / 60).toString().padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");

  if (!branch || !level || !topic || !session) {
    return (
      <View style={styles.root}>
        <Text style={{ color: "#FFFFFF", padding: 40 }}>Not found.</Text>
      </View>
    );
  }

  // ---------- INTERCEPT ----------
  if (stage === "intercept") {
    return (
      <View style={styles.root}>
        <AmbientBackground colors={branch.gradient} accent={branch.accent} />
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <View style={styles.topRow}>
            <TouchableOpacity
              testID="med-intercept-back"
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
              <Text style={[styles.eyebrow, { color: branch.accent }]}>
                {locale === "fa" ? branch.title_fa : branch.title_en} ·{" "}
                {locale === "fa" ? level.name_fa : level.name_en}
              </Text>
              <Text style={[styles.h1, { textAlign: rtl ? "right" : "left" }]}>
                {locale === "fa" ? session.title_fa : session.title_en}
              </Text>
              <Text style={[styles.sub, { textAlign: rtl ? "right" : "left" }]}>
                {locale === "fa" ? topic.title_fa : topic.title_en} ·{" "}
                {session.duration_min} {t(locale, "minutes")}
              </Text>
            </View>

            <GlassCard padding={20} radius={22} style={{ marginTop: 22 }}>
              <Text
                style={[styles.prereqHead, { textAlign: rtl ? "right" : "left" }]}
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
                  <View style={[styles.dot, { backgroundColor: branch.accent }]} />
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
              <AudioMatrix showAffirmations testIDPrefix="med-intercept-audio" />
            </View>
          </ScrollView>

          <View style={[styles.confirmWrap, { paddingBottom: insets.bottom + 18 }]}>
            <Pressable
              testID="med-long-press-begin"
              onPressIn={startHold}
              onPressOut={endHold}
              style={[styles.confirm, { backgroundColor: "#FFFFFF" }]}
            >
              <Animated.View
                style={[styles.confirmFill, { backgroundColor: branch.accent }, fillStyle]}
              />
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

  // ---------- COMPLETE ----------
  if (done) {
    return (
      <View style={styles.root}>
        <AmbientBackground colors={branch.gradient} accent={branch.accent} />
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
          <View style={styles.doneWrap}>
            <View
              style={[styles.doneOrb, { borderColor: branch.accent, shadowColor: branch.accent }]}
            >
              <Feather name="check" size={32} color={branch.accent} />
            </View>
            <Text style={styles.doneTitle}>{t(locale, "session_complete")}</Text>
            <Text style={styles.doneSub}>{t(locale, "complete_sub")}</Text>
            <TouchableOpacity
              testID="med-back-home-btn"
              onPress={() => router.replace("/(tabs)/meditation")}
              style={[styles.homeBtn, { borderColor: branch.accent }]}
            >
              <Text style={[styles.homeBtnText, { color: branch.accent }]}>
                {t(locale, "back_home")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ---------- PLAYER ----------
  const affirmation = audio.affirmations
    ? locale === "fa"
      ? session.affirmations_fa[affIdx] ?? ""
      : session.affirmations_en[affIdx] ?? ""
    : "";

  return (
    <View style={styles.root}>
      <AmbientBackground colors={branch.gradient} accent={branch.accent} />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View
          style={[
            styles.topRow,
            { flexDirection: rtl ? "row-reverse" : "row", justifyContent: "space-between" },
          ]}
        >
          <TouchableOpacity
            testID="med-player-close"
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Feather name="x" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <GlassCard padding={6} radius={999}>
            <View style={{ paddingHorizontal: 14, paddingVertical: 4 }}>
              <Text style={styles.timerText}>
                {mm}:{ss}
              </Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.sphereWrap}>
          <BreathSphere phase="inhale" duration={6} accent={branch.accent} size={300} />
        </View>

        <View style={styles.affirmWrap}>
          <Text style={styles.title} numberOfLines={2}>
            {locale === "fa" ? session.title_fa : session.title_en}
          </Text>
          {audio.affirmations && affirmation ? (
            <Text style={styles.affirmText} numberOfLines={3}>
              {`“${affirmation}”`}
            </Text>
          ) : (
            <Text style={styles.affirmHint}>
              {audio.affirmations
                ? "—"
                : locale === "fa"
                  ? "افیرمیشن خاموش"
                  : "Affirmations off"}
            </Text>
          )}
        </View>

        <View style={styles.controls}>
          <Pressable
            testID="med-pause-btn"
            onPress={() => setPaused((p) => !p)}
            style={[styles.pauseBtn, { backgroundColor: branch.accent }]}
          >
            <Feather
              name={paused ? "play" : "pause"}
              size={22}
              color="#050505"
            />
          </Pressable>
        </View>

        <MentorGreeting
          branch={branch}
          visible={showMentor}
          onAcknowledge={() => setShowMentor(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  topRow: { paddingHorizontal: 18, paddingTop: 6 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  scroll: { paddingHorizontal: 24, paddingTop: 12 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  h1: { color: "#FFFFFF", fontSize: 30, lineHeight: 36, fontWeight: "800", letterSpacing: -0.5 },
  sub: { color: "rgba(255,255,255,0.65)", fontSize: 13 },
  prereqHead: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 12,
  },
  prereqRow: { alignItems: "center", gap: 12, paddingVertical: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  prereqText: { color: "rgba(255,255,255,0.85)", fontSize: 15, flex: 1 },
  confirmWrap: { paddingHorizontal: 24, paddingTop: 12 },
  confirm: {
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
  },
  confirmContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 1,
  },
  confirmText: { color: "#050505", fontWeight: "700", fontSize: 15 },
  timerText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700", letterSpacing: 2 },
  sphereWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  affirmWrap: {
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
    minHeight: 110,
  },
  title: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  affirmText: {
    color: "#FFFFFF",
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    fontStyle: "italic",
  },
  affirmHint: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  controls: { alignItems: "center", paddingBottom: 12 },
  pauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  doneWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 14,
  },
  doneOrb: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.7,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 16,
  },
  doneTitle: { color: "#FFFFFF", fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  doneSub: { color: "rgba(255,255,255,0.7)", fontSize: 15, textAlign: "center", lineHeight: 22 },
  homeBtn: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  homeBtnText: { fontSize: 14, fontWeight: "700", letterSpacing: 1 },
});
