// Mentor greeting overlay. Translucent glass card with archetype name,
// quote and an "I am listening" acknowledgement button. Shown over a
// dim backdrop on the first session of a branch.

import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { GlassCard } from "@/src/components/GlassCard";
import { useApp } from "@/src/context/AppContext";
import type { Branch } from "@/src/data/branches";
import { isRTL, t } from "@/src/data/i18n";

type Props = {
  branch: Branch;
  visible: boolean;
  onAcknowledge: () => void;
};

export function MentorGreeting({ branch, visible, onAcknowledge }: Props) {
  const { locale } = useApp();
  const rtl = isRTL(locale);
  const m = branch.mentor;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <BlurView intensity={40} tint="dark" style={styles.scrim}>
        <View style={styles.center}>
          <GlassCard radius={28} padding={28} testID="mentor-greeting">
            <View style={styles.inner}>
              <View
                style={[
                  styles.sigil,
                  { borderColor: branch.accent, shadowColor: branch.accent },
                ]}
              >
                <Feather name={branch.glyph as never} size={28} color={branch.accent} />
              </View>
              <Text style={[styles.eyebrow, { color: branch.accent }]}>
                {locale === "fa"
                  ? `${m.name_fa} ${t(locale, "mentor_speaks")}`
                  : `${m.name_en} ${t(locale, "mentor_speaks")}`}
              </Text>
              <Text
                style={[
                  styles.archetype,
                  { textAlign: rtl ? "right" : "left" },
                ]}
              >
                {locale === "fa" ? m.archetype_fa : m.archetype_en}
              </Text>
              <Text
                style={[
                  styles.quote,
                  { textAlign: rtl ? "right" : "left" },
                ]}
              >
                {locale === "fa" ? `«${m.quote_fa}»` : `"${m.quote_en}"`}
              </Text>
              <TouchableOpacity
                testID="mentor-acknowledge"
                onPress={onAcknowledge}
                style={[
                  styles.ackBtn,
                  { borderColor: branch.accent },
                ]}
              >
                <Text style={[styles.ackText, { color: branch.accent }]}>
                  {t(locale, "acknowledge")}
                </Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  inner: { alignItems: "center", gap: 14 },
  sigil: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.8,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  archetype: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  quote: {
    color: "#FFFFFF",
    fontSize: 17,
    lineHeight: 26,
    fontStyle: "italic",
    marginVertical: 8,
  },
  ackBtn: {
    marginTop: 12,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  ackText: { fontSize: 14, fontWeight: "600", letterSpacing: 1 },
});
