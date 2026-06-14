// Breath player. Cycles through phases (inhale/hold/exhale/hold_empty),
// drives the Breath Sphere, counts breaths, and on completion logs to history.

import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AmbientBackground } from "@/src/components/AmbientBackground";
import { BreathSphere } from "@/src/components/BreathSphere";
import { GlassCard } from "@/src/components/GlassCard";
import { useApp } from "@/src/context/AppContext";
import { type BreathPhase, getBreathSession } from "@/src/data/breathwork";
import { isRTL, t } from "@/src/data/i18n";

const PHASE_ORDER: BreathPhase[] = ["inhale", "hold", "exhale", "hold_empty"];

export default function BreathPlayer() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const { locale, addHistory, audio } = useApp();
  const rtl = isRTL(locale);
  const session = getBreathSession(params.sessionId ?? "bw-b-act-wake");

  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycle, setCycle] = useState(1);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const phase = PHASE_ORDER[phaseIdx];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const accent = "#7BD5F5";

  const phaseDuration = useMemo(() => {
    if (!session) return 4;
    const map: Record<BreathPhase, number> = {
      inhale: session.pattern.inhale,
      hold: session.pattern.hold,
      exhale: session.pattern.exhale,
      hold_empty: session.pattern.hold_empty,
    };
    return map[phase];
  }, [phase, session]);

  // Skip phases with 0 duration
  const skipZero = useCallback(
    (start: number) => {
      if (!session) return start;
      const map: Record<BreathPhase, number> = {
        inhale: session.pattern.inhale,
        hold: session.pattern.hold,
        exhale: session.pattern.exhale,
        hold_empty: session.pattern.hold_empty,
      };
      let i = start;
      for (let n = 0; n < 5; n++) {
        if (map[PHASE_ORDER[i]] > 0) return i;
        i = (i + 1) % PHASE_ORDER.length;
      }
      return start;
    },
    [session],
  );

  const completeSession = useCallback(async () => {
    if (!session) return;
    setDone(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addHistory({
      kind: "breathwork",
      refId: session.id,
      title_en: session.title_en,
      title_fa: session.title_fa,
      duration_min: session.duration_min,
    });
  }, [session, addHistory]);

  useEffect(() => {
    if (!session || paused || done) return;
    const ms = Math.max(200, phaseDuration * 1000);
    timerRef.current = setTimeout(() => {
      Haptics.selectionAsync();
      let nextIdx = (phaseIdx + 1) % PHASE_ORDER.length;
      nextIdx = skipZero(nextIdx);
      if (nextIdx === 0) {
        const nextCycle = cycle + 1;
        if (nextCycle > session.cycles) {
          completeSession();
          return;
        }
        setCycle(nextCycle);
      }
      setPhaseIdx(nextIdx);
    }, ms);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, paused, done, phaseDuration, phaseIdx, cycle, session, skipZero, completeSession]);

  if (!session) {
    return (
      <View style={styles.root}>
        <Text style={{ color: "#FFF", padding: 40 }}>Session not found.</Text>
      </View>
    );
  }

  if (done) {
    return (
      <View style={styles.root}>
        <AmbientBackground
          colors={["#050505", "#0F1A28", "#1F324A"]}
          accent={accent}
        />
        <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
          <View style={styles.doneWrap}>
            <View
              style={[styles.doneOrb, { borderColor: accent, shadowColor: accent }]}
            >
              <Feather name="check" size={32} color={accent} />
            </View>
            <Text style={styles.doneTitle}>{t(locale, "session_complete")}</Text>
            <Text style={styles.doneSub}>{t(locale, "complete_sub")}</Text>
            <TouchableOpacity
              testID="back-home-btn"
              onPress={() => router.replace("/(tabs)/breathwork")}
              style={[styles.homeBtn, { borderColor: accent }]}
            >
              <Text style={[styles.homeBtnText, { color: accent }]}>
                {t(locale, "back_home")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AmbientBackground
        colors={["#050505", "#0F1A28", "#1F324A"]}
        accent={accent}
      />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View
          style={[
            styles.topRow,
            { flexDirection: rtl ? "row-reverse" : "row" },
          ]}
        >
          <TouchableOpacity
            testID="player-close"
            onPress={() => router.back()}
            style={styles.closeBtn}
          >
            <Feather name="x" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <GlassCard padding={8} radius={999}>
            <View
              style={[
                styles.cyclePill,
                { flexDirection: rtl ? "row-reverse" : "row" },
              ]}
            >
              <Text style={styles.cycleText}>
                {cycle} / {session.cycles}
              </Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.sphereWrap}>
          <BreathSphere phase={phase} duration={phaseDuration} accent={accent} size={300} />
        </View>

        <View style={styles.phaseLabelWrap}>
          <Text style={styles.phaseLabel}>{t(locale, phase)}</Text>
          <Text style={styles.phaseCount}>{phaseDuration}s</Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            testID="pause-btn"
            onPress={() => setPaused((p) => !p)}
            style={styles.pauseBtn}
          >
            <Feather
              name={paused ? "play" : "pause"}
              size={22}
              color="#050505"
            />
          </Pressable>
          <Text style={styles.audioHint}>
            {audio.vocalGuide ? "🔊" : "·"} · {audio.ambient ? "🎵" : "·"}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  topRow: {
    paddingHorizontal: 18,
    paddingTop: 6,
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  cyclePill: { paddingHorizontal: 14, paddingVertical: 4, alignItems: "center" },
  cycleText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },
  sphereWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  phaseLabelWrap: { alignItems: "center", marginBottom: 24 },
  phaseLabel: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "300",
    letterSpacing: 8,
    textTransform: "uppercase",
  },
  phaseCount: {
    color: "rgba(255,255,255,0.55)",
    marginTop: 4,
    fontSize: 13,
    letterSpacing: 2,
  },
  controls: {
    alignItems: "center",
    paddingBottom: 16,
    gap: 12,
  },
  pauseBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  audioHint: { color: "rgba(255,255,255,0.45)", fontSize: 11 },
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
  doneTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  doneSub: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  homeBtn: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  homeBtnText: { fontSize: 14, fontWeight: "700", letterSpacing: 1 },
});
