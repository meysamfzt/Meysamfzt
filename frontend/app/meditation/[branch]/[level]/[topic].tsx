// Topic detail: list of sessions. Tapping a session -> meditation player (with intercept).

import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AmbientBackground } from "@/src/components/AmbientBackground";
import { GlassCard } from "@/src/components/GlassCard";
import { useApp } from "@/src/context/AppContext";
import { getBranch, getLevel, getTopic } from "@/src/data/branches";
import { isRTL, t } from "@/src/data/i18n";

export default function TopicScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    branch?: string;
    level?: string;
    topic?: string;
  }>();
  const { locale } = useApp();
  const rtl = isRTL(locale);
  const branch = getBranch(params.branch ?? "");
  const level = getLevel(params.branch ?? "", params.level ?? "");
  const topic = getTopic(params.branch ?? "", params.level ?? "", params.topic ?? "");

  if (!branch || !level || !topic) {
    return (
      <View style={styles.root}>
        <Text style={{ color: "#FFFFFF", padding: 40 }}>Not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AmbientBackground colors={branch.gradient} accent={branch.accent} intensity={0.7} />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.topRow}>
          <TouchableOpacity
            testID="topic-back"
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
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 6, alignItems: rtl ? "flex-end" : "flex-start" }}>
            <Text style={[styles.eyebrow, { color: branch.accent }]}>
              {locale === "fa" ? level.name_fa : level.name_en} ·{" "}
              {locale === "fa" ? branch.title_fa : branch.title_en}
            </Text>
            <Text style={[styles.h1, { textAlign: rtl ? "right" : "left" }]}>
              {locale === "fa" ? topic.title_fa : topic.title_en}
            </Text>
          </View>

          <Text style={[styles.head, { textAlign: rtl ? "right" : "left" }]}>
            {t(locale, "sessions")}
          </Text>
          <View style={{ gap: 12 }}>
            {topic.sessions.map((s, idx) => (
              <TouchableOpacity
                key={s.id}
                testID={`med-session-${s.id}`}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/meditation/play",
                    params: {
                      branch: branch.id,
                      level: level.id,
                      topic: topic.id,
                      session: s.id,
                    },
                  })
                }
              >
                <GlassCard padding={16} radius={20}>
                  <View
                    style={[
                      styles.row,
                      { flexDirection: rtl ? "row-reverse" : "row" },
                    ]}
                  >
                    <View
                      style={[styles.badge, { borderColor: branch.accent }]}
                    >
                      <Text style={[styles.badgeText, { color: branch.accent }]}>
                        {idx + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.sTitle, { textAlign: rtl ? "right" : "left" }]}
                      >
                        {locale === "fa" ? s.title_fa : s.title_en}
                      </Text>
                      <View
                        style={[
                          styles.metaRow,
                          { flexDirection: rtl ? "row-reverse" : "row" },
                        ]}
                      >
                        <Feather name="clock" size={11} color="rgba(255,255,255,0.55)" />
                        <Text style={styles.metaText}>
                          {s.duration_min} {t(locale, "minutes")}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.playBubble,
                        { backgroundColor: `${branch.accent}22`, borderColor: branch.accent },
                      ]}
                    >
                      <Feather name="play" size={14} color={branch.accent} />
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  topRow: { paddingHorizontal: 16, paddingTop: 6 },
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
  scroll: { paddingHorizontal: 24, paddingTop: 16 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  h1: { color: "#FFFFFF", fontSize: 32, lineHeight: 38, fontWeight: "800", letterSpacing: -0.5 },
  head: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 12,
  },
  row: { alignItems: "center", gap: 12 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  badgeText: { fontSize: 13, fontWeight: "800" },
  sTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  metaRow: { alignItems: "center", gap: 4, marginTop: 4 },
  metaText: { color: "rgba(255,255,255,0.55)", fontSize: 11 },
  playBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
