// Meditation tab. 11-branch grid with per-branch color schemes.

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AmbientBackground } from "@/src/components/AmbientBackground";
import { GlassCard } from "@/src/components/GlassCard";
import { LanguageToggle } from "@/src/components/LanguageToggle";
import { useApp } from "@/src/context/AppContext";
import { BRANCHES, type Branch } from "@/src/data/branches";
import { isRTL, t } from "@/src/data/i18n";

export default function MeditationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { locale } = useApp();
  const rtl = isRTL(locale);

  return (
    <View style={styles.root}>
      <AmbientBackground
        colors={["#050505", "#1A0A2A", "#34103F"]}
        accent="#B984FF"
      />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View
          style={[
            styles.header,
            { flexDirection: rtl ? "row-reverse" : "row" },
          ]}
        >
          <View>
            <Text
              style={[styles.eyebrow, { textAlign: rtl ? "right" : "left" }]}
            >
              {t(locale, "tab_meditation")}
            </Text>
            <Text
              style={[styles.title, { textAlign: rtl ? "right" : "left" }]}
            >
              {t(locale, "meditation_title")}
            </Text>
            <Text
              style={[styles.sub, { textAlign: rtl ? "right" : "left" }]}
            >
              {t(locale, "meditation_sub")}
            </Text>
          </View>
          <LanguageToggle compact />
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.grid,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {BRANCHES.map((b) => (
            <BranchCard
              key={b.id}
              branch={b}
              locale={locale}
              rtl={rtl}
              onPress={() =>
                router.push({ pathname: "/meditation/[branch]", params: { branch: b.id } })
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function BranchCard({
  branch,
  locale,
  rtl,
  onPress,
}: {
  branch: Branch;
  locale: "en" | "fa";
  rtl: boolean;
  onPress: () => void;
}) {
  const title = locale === "fa" ? branch.title_fa : branch.title_en;
  const tagline = locale === "fa" ? branch.tagline_fa : branch.tagline_en;
  const levelsCount = branch.levels.length;
  return (
    <Pressable
      testID={`branch-${branch.id}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.cellInner}>
        <LinearGradient
          colors={branch.gradient as [string, string, ...string[]]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <GlassCard
          padding={16}
          radius={22}
          bg="rgba(0,0,0,0.18)"
          borderColor="rgba(255,255,255,0.14)"
          style={styles.cellGlass}
        >
          <View style={{ flex: 1, gap: 6, alignItems: rtl ? "flex-end" : "flex-start" }}>
            <View
              style={[
                styles.sigil,
                {
                  borderColor: branch.accent,
                  shadowColor: branch.accent,
                },
              ]}
            >
              <Feather name={branch.glyph as never} size={18} color={branch.accent} />
            </View>
            <Text
              style={[styles.branchTitle, { textAlign: rtl ? "right" : "left" }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              style={[styles.branchTagline, { textAlign: rtl ? "right" : "left" }]}
              numberOfLines={2}
            >
              {tagline}
            </Text>
            <View
              style={[
                styles.levelsPill,
                { borderColor: `${branch.accent}55` },
              ]}
            >
              <Text style={[styles.levelsPillText, { color: branch.accent }]}>
                {levelsCount} {t(locale, "levels")}
              </Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginTop: 4,
  },
  sub: { color: "rgba(255,255,255,0.6)", marginTop: 4, fontSize: 13 },
  grid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 8,
  },
  cell: {
    width: "50%",
    padding: 8,
    aspectRatio: 0.82,
  },
  cellInner: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
  },
  cellGlass: { flex: 1 },
  sigil: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 6,
  },
  branchTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "700", letterSpacing: -0.3 },
  branchTagline: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
  levelsPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  levelsPillText: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
});
