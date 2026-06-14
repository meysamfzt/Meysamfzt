// Level detail: list of topics. Tapping a topic -> sessions list.

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
import { getBranch, getLevel } from "@/src/data/branches";
import { isRTL, t } from "@/src/data/i18n";

export default function LevelScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ branch?: string; level?: string }>();
  const { locale } = useApp();
  const rtl = isRTL(locale);
  const branch = getBranch(params.branch ?? "");
  const level = getLevel(params.branch ?? "", params.level ?? "");

  if (!branch || !level) {
    return (
      <View style={styles.root}>
        <Text style={{ color: "#FFFFFF", padding: 40 }}>Not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AmbientBackground colors={branch.gradient} accent={branch.accent} intensity={0.85} />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.topRow}>
          <TouchableOpacity
            testID="level-back"
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
              {t(locale, "level")} {level.index} · {locale === "fa" ? branch.title_fa : branch.title_en}
            </Text>
            <Text style={[styles.h1, { textAlign: rtl ? "right" : "left" }]}>
              {locale === "fa" ? level.name_fa : level.name_en}
            </Text>
          </View>

          <Text style={[styles.head, { textAlign: rtl ? "right" : "left" }]}>
            {t(locale, "topics")}
          </Text>
          <View style={{ gap: 12 }}>
            {level.topics.map((top) => (
              <TouchableOpacity
                key={top.id}
                testID={`topic-${top.id}`}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/meditation/[branch]/[level]/[topic]",
                    params: {
                      branch: branch.id,
                      level: level.id,
                      topic: top.id,
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
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.topTitle, { textAlign: rtl ? "right" : "left" }]}
                      >
                        {locale === "fa" ? top.title_fa : top.title_en}
                      </Text>
                      <Text
                        style={[styles.topMeta, { textAlign: rtl ? "right" : "left" }]}
                      >
                        {top.sessions.length} {t(locale, "sessions")}
                      </Text>
                    </View>
                    <Feather
                      name={rtl ? "chevron-left" : "chevron-right"}
                      size={18}
                      color="rgba(255,255,255,0.6)"
                    />
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
  h1: { color: "#FFFFFF", fontSize: 34, lineHeight: 40, fontWeight: "800", letterSpacing: -0.5 },
  head: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
    marginTop: 22,
    marginBottom: 12,
  },
  row: { alignItems: "center", gap: 14 },
  topTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  topMeta: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
});
