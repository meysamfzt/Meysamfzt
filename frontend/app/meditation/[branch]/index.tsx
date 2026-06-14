// Meditation branch detail. Shows the branch hero + list of levels.

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
import { getBranch } from "@/src/data/branches";
import { isRTL, t } from "@/src/data/i18n";

export default function BranchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ branch?: string }>();
  const { locale } = useApp();
  const rtl = isRTL(locale);
  const branch = getBranch(params.branch ?? "");

  if (!branch) {
    return (
      <View style={styles.root}>
        <Text style={{ color: "#FFFFFF", padding: 40 }}>Branch not found.</Text>
      </View>
    );
  }

  const title = locale === "fa" ? branch.title_fa : branch.title_en;
  const tagline = locale === "fa" ? branch.tagline_fa : branch.tagline_en;
  const mentorName = locale === "fa" ? branch.mentor.name_fa : branch.mentor.name_en;
  const mentorArch = locale === "fa" ? branch.mentor.archetype_fa : branch.mentor.archetype_en;

  return (
    <View style={styles.root}>
      <AmbientBackground colors={branch.gradient} accent={branch.accent} />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View
          style={[styles.topRow, { flexDirection: rtl ? "row-reverse" : "row" }]}
        >
          <TouchableOpacity
            testID="branch-back"
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
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={{ gap: 10, alignItems: rtl ? "flex-end" : "flex-start" }}>
            <View
              style={[
                styles.sigil,
                { borderColor: branch.accent, shadowColor: branch.accent },
              ]}
            >
              <Feather name={branch.glyph as never} size={28} color={branch.accent} />
            </View>
            <Text style={[styles.eyebrow, { color: branch.accent }]}>
              {locale === "fa" ? "شاخه" : "Branch"}
            </Text>
            <Text style={[styles.h1, { textAlign: rtl ? "right" : "left" }]}>
              {title}
            </Text>
            <Text style={[styles.sub, { textAlign: rtl ? "right" : "left" }]}>
              {tagline}
            </Text>
          </View>

          {/* Mentor preview */}
          <GlassCard
            padding={18}
            radius={22}
            style={{ marginTop: 22 }}
            borderColor={`${branch.accent}55`}
            testID="mentor-preview"
          >
            <View
              style={[
                styles.mentorRow,
                { flexDirection: rtl ? "row-reverse" : "row" },
              ]}
            >
              <View
                style={[
                  styles.mentorBubble,
                  { borderColor: branch.accent },
                ]}
              >
                <Feather name="star" size={16} color={branch.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.mentorEyebrow, { color: branch.accent, textAlign: rtl ? "right" : "left" }]}
                >
                  {locale === "fa" ? "مربی این شاخه" : "Mentor of this branch"}
                </Text>
                <Text style={[styles.mentorName, { textAlign: rtl ? "right" : "left" }]}>
                  {mentorName}
                </Text>
                <Text style={[styles.mentorArch, { textAlign: rtl ? "right" : "left" }]}>
                  {mentorArch}
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Levels list */}
          <Text style={[styles.levelsHead, { textAlign: rtl ? "right" : "left" }]}>
            {t(locale, "levels")}
          </Text>
          <View style={{ gap: 12 }}>
            {branch.levels.map((lv, idx) => {
              const lvName = locale === "fa" ? lv.name_fa : lv.name_en;
              return (
                <TouchableOpacity
                  key={lv.id}
                  testID={`level-${lv.id}`}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/meditation/[branch]/[level]",
                      params: { branch: branch.id, level: lv.id },
                    })
                  }
                >
                  <GlassCard padding={16} radius={20}>
                    <View
                      style={[
                        styles.lvRow,
                        { flexDirection: rtl ? "row-reverse" : "row" },
                      ]}
                    >
                      <View
                        style={[
                          styles.lvBadge,
                          { borderColor: branch.accent },
                        ]}
                      >
                        <Text style={[styles.lvBadgeText, { color: branch.accent }]}>
                          {idx + 1}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[styles.lvName, { textAlign: rtl ? "right" : "left" }]}
                        >
                          {lvName}
                        </Text>
                        <Text
                          style={[styles.lvMeta, { textAlign: rtl ? "right" : "left" }]}
                        >
                          {lv.topics.length} {t(locale, "topics")}
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
              );
            })}
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
  scroll: { paddingHorizontal: 24, paddingTop: 12 },
  sigil: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 6,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  h1: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
    letterSpacing: -1,
  },
  sub: { color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 22 },
  mentorRow: { alignItems: "center", gap: 14 },
  mentorBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  mentorEyebrow: {
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  mentorName: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", marginTop: 2 },
  mentorArch: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 1 },
  levelsHead: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
    marginTop: 26,
    marginBottom: 12,
  },
  lvRow: { alignItems: "center", gap: 14 },
  lvBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  lvBadgeText: { fontSize: 14, fontWeight: "800" },
  lvName: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  lvMeta: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
});
