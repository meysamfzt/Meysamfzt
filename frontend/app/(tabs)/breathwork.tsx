// Breathwork tab. 3 tiers, each lists sessions split by stream (Activity / Goal).
// Sticky filter chips row.

import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { LanguageToggle } from "@/src/components/LanguageToggle";
import { useApp } from "@/src/context/AppContext";
import {
  BREATHWORK_SESSIONS,
  type BreathworkSession,
  TIERS,
} from "@/src/data/breathwork";
import { isRTL, t } from "@/src/data/i18n";

type TierKey = "beginner" | "intermediate" | "advanced";
type StreamKey = "all" | "activity" | "goal";

export default function BreathworkScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { locale } = useApp();
  const rtl = isRTL(locale);
  const [tier, setTier] = useState<TierKey>("beginner");
  const [stream, setStream] = useState<StreamKey>("all");

  const list = useMemo(
    () =>
      BREATHWORK_SESSIONS.filter(
        (s) => s.tier === tier && (stream === "all" || s.stream === stream),
      ),
    [tier, stream],
  );

  return (
    <View style={styles.root}>
      <AmbientBackground
        colors={["#050505", "#101824", "#1F2F44"]}
        accent="#7BD5F5"
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
              {t(locale, "tab_breathwork")}
            </Text>
            <Text
              style={[styles.title, { textAlign: rtl ? "right" : "left" }]}
            >
              {t(locale, "breathwork_title")}
            </Text>
            <Text
              style={[styles.sub, { textAlign: rtl ? "right" : "left" }]}
            >
              {t(locale, "breathwork_sub")}
            </Text>
          </View>
          <LanguageToggle compact />
        </View>

        {/* Sticky filter chip rows */}
        <View style={{ gap: 10, marginTop: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {TIERS.map((k) => (
              <Chip
                key={k}
                testID={`tier-${k}`}
                label={t(locale, `tier_${k}`)}
                active={tier === k}
                onPress={() => setTier(k)}
              />
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <Chip
              testID="stream-all"
              label={locale === "fa" ? "همه" : "All"}
              active={stream === "all"}
              onPress={() => setStream("all")}
            />
            <Chip
              testID="stream-activity"
              label={t(locale, "stream_activity")}
              active={stream === "activity"}
              onPress={() => setStream("activity")}
            />
            <Chip
              testID="stream-goal"
              label={t(locale, "stream_goal")}
              active={stream === "goal"}
              onPress={() => setStream("goal")}
            />
          </ScrollView>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.listPad,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {list.map((s) => (
            <SessionRow
              key={s.id}
              session={s}
              rtl={rtl}
              locale={locale}
              onPress={() =>
                router.push({
                  pathname: "/breath/intercept",
                  params: { sessionId: s.id },
                })
              }
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
  testID,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  testID: string;
}) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SessionRow({
  session,
  locale,
  rtl,
  onPress,
}: {
  session: BreathworkSession;
  locale: "en" | "fa";
  rtl: boolean;
  onPress: () => void;
}) {
  const title = locale === "fa" ? session.title_fa : session.title_en;
  const cat = locale === "fa" ? session.category_fa : session.category_en;
  const desc = locale === "fa" ? session.description_fa : session.description_en;
  return (
    <TouchableOpacity
      testID={`bw-session-${session.id}`}
      onPress={onPress}
      activeOpacity={0.85}
      style={{ marginBottom: 14 }}
    >
      <GlassCard padding={18} radius={22}>
        <View
          style={[styles.rowItem, { flexDirection: rtl ? "row-reverse" : "row" }]}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={[styles.rowEyebrow, { textAlign: rtl ? "right" : "left" }]}
            >
              {cat}
            </Text>
            <Text
              style={[styles.rowTitle, { textAlign: rtl ? "right" : "left" }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              style={[styles.rowSub, { textAlign: rtl ? "right" : "left" }]}
              numberOfLines={2}
            >
              {desc}
            </Text>
            <View
              style={[
                styles.rowMeta,
                { flexDirection: rtl ? "row-reverse" : "row" },
              ]}
            >
              <Meta
                icon="clock"
                label={`${session.duration_min} ${t(locale, "minutes")}`}
              />
              <Meta
                icon="repeat"
                label={`${session.cycles} ${t(locale, "cycles")}`}
              />
              <Meta
                icon="activity"
                label={`${session.pattern.inhale}-${session.pattern.hold}-${session.pattern.exhale}-${session.pattern.hold_empty}`}
              />
            </View>
          </View>
          <View style={styles.playBubble}>
            <Feather name={rtl ? "chevron-left" : "chevron-right"} size={18} color="#FFFFFF" />
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

function Meta({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Feather name={icon} size={11} color="rgba(255,255,255,0.55)" />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050505" },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 6,
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
  chipRow: {
    paddingHorizontal: 24,
    gap: 8,
    flexDirection: "row",
  },
  chip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chipActive: {
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  chipText: { color: "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: "600" },
  chipTextActive: { color: "#FFFFFF" },
  listPad: { paddingHorizontal: 24, paddingTop: 18 },
  rowItem: { alignItems: "center", gap: 14 },
  rowEyebrow: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  rowTitle: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  rowSub: { color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 18 },
  rowMeta: { gap: 12, marginTop: 8, flexWrap: "wrap" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: "rgba(255,255,255,0.55)", fontSize: 11, fontWeight: "500" },
  playBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
});
