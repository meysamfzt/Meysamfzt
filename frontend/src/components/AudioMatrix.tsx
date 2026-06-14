// Reusable audio control matrix. Used in both Breathwork & Meditation
// intercept screens and in profile. Toggles update AppContext audio prefs.
// Audio playback itself is currently mocked — toggles drive UI/state only.

import { Feather } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

import { GlassCard } from "@/src/components/GlassCard";
import { useApp } from "@/src/context/AppContext";
import { isRTL, t } from "@/src/data/i18n";

type Props = {
  showAffirmations?: boolean;
  testIDPrefix?: string;
};

export function AudioMatrix({
  showAffirmations = false,
  testIDPrefix = "audio",
}: Props) {
  const { locale, audio, setAudio } = useApp();
  const rtl = isRTL(locale);

  const rows = [
    {
      key: "vocalGuide" as const,
      icon: "mic" as const,
      title: t(locale, "vocal_guide"),
      sub: t(locale, "vocal_guide_sub"),
      value: audio.vocalGuide,
      testID: `${testIDPrefix}-vocal-guide-toggle`,
    },
    {
      key: "ambient" as const,
      icon: "wind" as const,
      title: t(locale, "ambient_layer"),
      sub: t(locale, "ambient_sub"),
      value: audio.ambient,
      testID: `${testIDPrefix}-ambient-toggle`,
    },
    ...(showAffirmations
      ? [
          {
            key: "affirmations" as const,
            icon: "feather" as const,
            title: t(locale, "affirmations"),
            sub: t(locale, "affirmations_sub"),
            value: audio.affirmations,
            testID: `${testIDPrefix}-affirmations-toggle`,
          },
        ]
      : []),
  ];

  return (
    <GlassCard testID={`${testIDPrefix}-matrix`} padding={4} radius={20}>
      <View style={styles.inner}>
        <Text
          style={[
            styles.heading,
            { textAlign: rtl ? "right" : "left" },
          ]}
        >
          {t(locale, "audio_matrix")}
        </Text>
        {rows.map((row, idx) => (
          <View
            key={row.key}
            style={[
              styles.row,
              { flexDirection: rtl ? "row-reverse" : "row" },
              idx < rows.length - 1 && styles.rowDivider,
            ]}
          >
            <View
              style={[
                styles.iconBubble,
                { backgroundColor: row.value ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)" },
              ]}
            >
              <Feather
                name={row.icon}
                size={18}
                color={row.value ? "#FFFFFF" : "rgba(255,255,255,0.5)"}
              />
            </View>
            <View style={styles.textCol}>
              <Text
                style={[
                  styles.title,
                  { textAlign: rtl ? "right" : "left" },
                ]}
              >
                {row.title}
              </Text>
              <Text
                style={[
                  styles.sub,
                  { textAlign: rtl ? "right" : "left" },
                ]}
              >
                {row.sub}
              </Text>
            </View>
            <Switch
              testID={row.testID}
              value={row.value}
              onValueChange={(v) => setAudio({ [row.key]: v })}
              trackColor={{
                false: "rgba(255,255,255,0.1)",
                true: "rgba(255,255,255,0.45)",
              }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="rgba(255,255,255,0.1)"
            />
          </View>
        ))}

        {/* Custom audio info (placeholder UI) */}
        <View
          style={[styles.customWrap, { alignItems: rtl ? "flex-end" : "flex-start" }]}
        >
          <Text style={styles.customHeading}>{t(locale, "custom_audio")}</Text>
          <View
            style={[styles.customRow, { flexDirection: rtl ? "row-reverse" : "row" }]}
          >
            <CustomChip label={t(locale, "intro_track")} />
            <CustomChip label={t(locale, "outro_track")} />
            <CustomChip label={t(locale, "interval_track")} />
          </View>
          <Text style={[styles.customHint, { textAlign: rtl ? "right" : "left" }]}>
            {t(locale, "interval_every")} · {audio.intervalCount}
          </Text>
          <View
            style={[styles.intervalRow, { flexDirection: rtl ? "row-reverse" : "row" }]}
          >
            {[5, 10, 15, 20].map((n) => {
              const active = audio.intervalCount === n;
              return (
                <TouchableOpacity
                  key={n}
                  testID={`${testIDPrefix}-interval-${n}`}
                  onPress={() => setAudio({ intervalCount: n })}
                  style={[
                    styles.intervalChip,
                    active && styles.intervalChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.intervalChipText,
                      active && styles.intervalChipTextActive,
                    ]}
                  >
                    {n}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

function CustomChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Feather name="upload" size={12} color="rgba(255,255,255,0.7)" />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: { paddingHorizontal: 16, paddingVertical: 12 },
  heading: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: { flex: 1 },
  title: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  sub: { color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 2 },
  customWrap: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  customHeading: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 10,
  },
  customRow: { gap: 8, flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  chipText: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "500" },
  customHint: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 14,
    marginBottom: 8,
  },
  intervalRow: { gap: 8 },
  intervalChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  intervalChipActive: {
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  intervalChipText: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" },
  intervalChipTextActive: { color: "#FFFFFF" },
});
