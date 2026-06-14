// Profile tab. Shows stats, language toggle, audio defaults, history list.

import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { AmbientBackground } from "@/src/components/AmbientBackground";
import { AudioMatrix } from "@/src/components/AudioMatrix";
import { GlassCard } from "@/src/components/GlassCard";
import { LanguageToggle } from "@/src/components/LanguageToggle";
import { useApp } from "@/src/context/AppContext";
import { isRTL, t } from "@/src/data/i18n";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { locale, history, clearHistory } = useApp();
  const rtl = isRTL(locale);

  const stats = useMemo(() => {
    const total = history.length;
    const minutes = history.reduce((acc, h) => acc + h.duration_min, 0);
    const days = new Set(history.map((h) => h.completedAt.slice(0, 10))).size;
    return { total, minutes, days };
  }, [history]);

  return (
    <View style={styles.root}>
      <AmbientBackground
        colors={["#050505", "#0F1218", "#1B1E26"]}
        accent="#A0A8B6"
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
              {t(locale, "tab_profile")}
            </Text>
            <Text
              style={[styles.title, { textAlign: rtl ? "right" : "left" }]}
            >
              {t(locale, "profile_title")}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + 120 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats */}
          <GlassCard padding={18} radius={22} testID="stats-card">
            <View
              style={[
                styles.statRow,
                { flexDirection: rtl ? "row-reverse" : "row" },
              ]}
            >
              <StatBox value={stats.total} label={t(locale, "total_sessions")} />
              <StatDivider />
              <StatBox value={stats.minutes} label={t(locale, "total_minutes")} />
              <StatDivider />
              <StatBox value={stats.days} label={t(locale, "streak")} />
            </View>
          </GlassCard>

          {/* Language */}
          <View style={{ marginTop: 18 }}>
            <SectionHeader title={t(locale, "language")} rtl={rtl} />
            <GlassCard padding={16} radius={20}>
              <View
                style={[
                  styles.langRow,
                  { flexDirection: rtl ? "row-reverse" : "row" },
                ]}
              >
                <Text style={styles.langText}>
                  {locale === "fa" ? "فارسی" : "English"}
                </Text>
                <LanguageToggle compact />
              </View>
            </GlassCard>
          </View>

          {/* Audio defaults */}
          <View style={{ marginTop: 18 }}>
            <SectionHeader title={t(locale, "audio_defaults")} rtl={rtl} />
            <AudioMatrix showAffirmations testIDPrefix="profile-audio" />
          </View>

          {/* History */}
          <View style={{ marginTop: 18 }}>
            <View
              style={[
                styles.histHead,
                { flexDirection: rtl ? "row-reverse" : "row" },
              ]}
            >
              <SectionHeader title={t(locale, "history")} rtl={rtl} noMargin />
              {history.length > 0 && (
                <TouchableOpacity
                  testID="clear-history-btn"
                  onPress={clearHistory}
                  style={styles.clearBtn}
                >
                  <Feather name="trash-2" size={12} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.clearText}>
                    {locale === "fa" ? "پاک کن" : "Clear"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {history.length === 0 ? (
              <GlassCard padding={20} radius={20}>
                <Text style={[styles.empty, { textAlign: rtl ? "right" : "left" }]}>
                  {t(locale, "no_history")}
                </Text>
              </GlassCard>
            ) : (
              <View style={{ gap: 10 }}>
                {history.slice(0, 20).map((h) => (
                  <GlassCard key={h.id} padding={14} radius={18}>
                    <View
                      style={[
                        styles.histRow,
                        { flexDirection: rtl ? "row-reverse" : "row" },
                      ]}
                    >
                      <View
                        style={[
                          styles.histIcon,
                          {
                            backgroundColor:
                              h.kind === "breathwork"
                                ? "rgba(123,213,245,0.15)"
                                : "rgba(185,132,255,0.15)",
                          },
                        ]}
                      >
                        <Feather
                          name={h.kind === "breathwork" ? "wind" : "circle"}
                          size={14}
                          color="#FFFFFF"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.histTitle,
                            { textAlign: rtl ? "right" : "left" },
                          ]}
                          numberOfLines={1}
                        >
                          {locale === "fa" ? h.title_fa : h.title_en}
                        </Text>
                        <Text
                          style={[
                            styles.histMeta,
                            { textAlign: rtl ? "right" : "left" },
                          ]}
                        >
                          {h.duration_min} {t(locale, "minutes")} ·{" "}
                          {new Date(h.completedAt).toLocaleDateString(
                            locale === "fa" ? "fa-IR" : "en-US",
                          )}
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}
function StatDivider() {
  return <View style={styles.statDivider} />;
}

function SectionHeader({
  title,
  rtl,
  noMargin,
}: {
  title: string;
  rtl: boolean;
  noMargin?: boolean;
}) {
  return (
    <Text
      style={[
        styles.sectionHeader,
        { textAlign: rtl ? "right" : "left", marginBottom: noMargin ? 0 : 10 },
      ]}
    >
      {title}
    </Text>
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
  scroll: { paddingHorizontal: 24, paddingTop: 6 },
  statRow: { alignItems: "center" },
  statBox: { flex: 1, alignItems: "center", gap: 4, paddingHorizontal: 6 },
  statValue: { color: "#FFFFFF", fontSize: 26, fontWeight: "800", letterSpacing: -1 },
  statLabel: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  sectionHeader: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  langRow: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  langText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  histHead: {
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  clearText: { color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "600" },
  empty: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontStyle: "italic" },
  histRow: { alignItems: "center", gap: 12 },
  histIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  histTitle: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  histMeta: { color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 2 },
});
