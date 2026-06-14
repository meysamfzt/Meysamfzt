// Onboarding flow. Two steps:
//  1) Welcome + Language toggle + "Recommended" baseline session shortcut + Personalize.
//  2) Diagnostic glass chips (goals + experience) -> persist profile -> tabs.

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AmbientBackground } from "@/src/components/AmbientBackground";
import { GlassCard } from "@/src/components/GlassCard";
import { LanguageToggle } from "@/src/components/LanguageToggle";
import { useApp } from "@/src/context/AppContext";
import { isRTL, t } from "@/src/data/i18n";

const GOALS = [
  { id: "calm", label: "goal_calm", icon: "moon" as const },
  { id: "sleep", label: "goal_sleep", icon: "cloud" as const },
  { id: "focus", label: "goal_focus", icon: "zap" as const },
  { id: "energy", label: "goal_energy", icon: "sun" as const },
  { id: "explore", label: "goal_explore", icon: "compass" as const },
  { id: "heal", label: "goal_heal", icon: "heart" as const },
];

const EXPERIENCES = [
  { id: "new" as const, label: "exp_new" },
  { id: "some" as const, label: "exp_some" },
  { id: "seasoned" as const, label: "exp_seasoned" },
];

export default function Onboarding() {
  const router = useRouter();
  const { locale, setOnboarded, setProfile } = useApp();
  const rtl = isRTL(locale);
  const [step, setStep] = useState<0 | 1>(0);
  const [goals, setGoalsSel] = useState<string[]>([]);
  const [exp, setExp] = useState<"new" | "some" | "seasoned">("new");

  const toggleGoal = (id: string) => {
    setGoalsSel((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  };

  const finish = async (recommended?: boolean) => {
    await setProfile({
      id: `p-${Date.now()}`,
      goals,
      experience: exp,
      createdAt: new Date().toISOString(),
    });
    await setOnboarded(true);
    if (recommended) {
      router.replace({
        pathname: "/breath/intercept",
        params: { sessionId: "bw-b-act-wake" },
      });
    } else {
      router.replace("/(tabs)/breathwork");
    }
  };

  return (
    <View style={styles.root}>
      <AmbientBackground
        colors={["#050505", "#0A0F1F", "#1B2438"]}
        accent="#7C9CFF"
      />
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <View
          style={[styles.topRow, { flexDirection: rtl ? "row-reverse" : "row" }]}
        >
          <Text style={styles.brand}>{t(locale, "app_name")}</Text>
          <LanguageToggle compact />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {step === 0 ? (
            <View style={{ gap: 24 }}>
              <View style={{ gap: 8, alignItems: rtl ? "flex-end" : "flex-start" }}>
                <Text style={[styles.eyebrow, { textAlign: rtl ? "right" : "left" }]}>
                  {t(locale, "welcome_title")}
                </Text>
                <Text style={[styles.title, { textAlign: rtl ? "right" : "left" }]}>
                  {t(locale, "app_tagline")}
                </Text>
                <Text style={[styles.body, { textAlign: rtl ? "right" : "left" }]}>
                  {t(locale, "welcome_body")}
                </Text>
              </View>

              <GlassCard padding={0} radius={28} testID="recommended-card">
                <View style={styles.recommended}>
                  <View
                    style={[
                      styles.recommendedRow,
                      { flexDirection: rtl ? "row-reverse" : "row" },
                    ]}
                  >
                    <View
                      style={[styles.recBadge, { borderColor: "#7C9CFF" }]}
                    >
                      <Text style={[styles.recBadgeText, { color: "#7C9CFF" }]}>
                        {t(locale, "recommended")}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.recTitle,
                      { textAlign: rtl ? "right" : "left" },
                    ]}
                  >
                    {locale === "fa"
                      ? "نفس بیداری صبح"
                      : "Morning Awakening Breath"}
                  </Text>
                  <Text
                    style={[
                      styles.recSub,
                      { textAlign: rtl ? "right" : "left" },
                    ]}
                  >
                    {locale === "fa"
                      ? "۲ دقیقه · ریتم ۴-۲-۴ ملایم"
                      : "2 min · gentle 4-2-4 rhythm"}
                  </Text>
                  <TouchableOpacity
                    testID="start-baseline-btn"
                    onPress={() => finish(true)}
                    style={styles.primaryBtn}
                  >
                    <Feather name="play" size={16} color="#050505" />
                    <Text style={styles.primaryBtnText}>
                      {t(locale, "start_baseline")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </GlassCard>

              <TouchableOpacity
                testID="personalize-btn"
                onPress={() => setStep(1)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>
                  {t(locale, "personalize")}
                </Text>
                <Feather
                  name={rtl ? "arrow-left" : "arrow-right"}
                  size={16}
                  color="rgba(255,255,255,0.9)"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ gap: 28 }}>
              <View style={{ gap: 6, alignItems: rtl ? "flex-end" : "flex-start" }}>
                <Text style={[styles.eyebrow, { textAlign: rtl ? "right" : "left" }]}>
                  {t(locale, "personalize")}
                </Text>
                <Text style={[styles.h2, { textAlign: rtl ? "right" : "left" }]}>
                  {t(locale, "what_brings_you")}
                </Text>
              </View>

              <View style={styles.grid}>
                {GOALS.map((g) => {
                  const active = goals.includes(g.id);
                  return (
                    <Pressable
                      key={g.id}
                      testID={`goal-${g.id}`}
                      onPress={() => toggleGoal(g.id)}
                      style={[styles.goalCell]}
                    >
                      <GlassCard
                        padding={16}
                        radius={20}
                        borderColor={
                          active ? "rgba(124,156,255,0.6)" : "rgba(255,255,255,0.12)"
                        }
                        bg={active ? "rgba(124,156,255,0.12)" : "rgba(255,255,255,0.04)"}
                      >
                        <View
                          style={{
                            alignItems: "center",
                            gap: 10,
                            paddingVertical: 6,
                          }}
                        >
                          <Feather
                            name={g.icon}
                            size={22}
                            color={active ? "#7C9CFF" : "rgba(255,255,255,0.85)"}
                          />
                          <Text style={styles.goalLabel} numberOfLines={2}>
                            {t(locale, g.label)}
                          </Text>
                        </View>
                      </GlassCard>
                    </Pressable>
                  );
                })}
              </View>

              <View style={{ gap: 12, alignItems: rtl ? "flex-end" : "flex-start" }}>
                <Text style={[styles.h3, { textAlign: rtl ? "right" : "left" }]}>
                  {t(locale, "experience")}
                </Text>
                <View
                  style={[
                    styles.expRow,
                    { flexDirection: rtl ? "row-reverse" : "row" },
                  ]}
                >
                  {EXPERIENCES.map((e) => {
                    const active = exp === e.id;
                    return (
                      <TouchableOpacity
                        key={e.id}
                        testID={`exp-${e.id}`}
                        onPress={() => setExp(e.id)}
                        style={[
                          styles.expChip,
                          active && styles.expChipActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.expChipText,
                            active && styles.expChipTextActive,
                          ]}
                        >
                          {t(locale, e.label)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity
                testID="enter-app-btn"
                onPress={() => finish(false)}
                style={[styles.primaryBtn, { alignSelf: "stretch", justifyContent: "center" }]}
              >
                <Text style={styles.primaryBtnText}>{t(locale, "enter")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  topRow: {
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  scroll: { padding: 24, paddingTop: 32, paddingBottom: 48 },
  eyebrow: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 42,
    fontWeight: "800",
    letterSpacing: -1,
  },
  body: { color: "rgba(255,255,255,0.7)", fontSize: 16, lineHeight: 24 },
  recommended: { padding: 22, gap: 8 },
  recommendedRow: { alignItems: "center" },
  recBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  recBadgeText: { fontSize: 10, letterSpacing: 2, fontWeight: "700", textTransform: "uppercase" },
  recTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "700", marginTop: 8 },
  recSub: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 },
  primaryBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryBtnText: { color: "#050505", fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  secondaryBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  h2: { color: "#FFFFFF", fontSize: 28, lineHeight: 34, fontWeight: "700", letterSpacing: -0.5 },
  h3: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 },
  goalCell: { width: "33.33%", padding: 6 },
  goalLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  expRow: { gap: 10, flexWrap: "wrap" },
  expChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  expChipActive: {
    borderColor: "rgba(124,156,255,0.65)",
    backgroundColor: "rgba(124,156,255,0.12)",
  },
  expChipText: { color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: "600" },
  expChipTextActive: { color: "#FFFFFF" },
});
