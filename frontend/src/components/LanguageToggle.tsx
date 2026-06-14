// Compact bilingual pill toggle (EN | فا).

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp } from "@/src/context/AppContext";
import type { Locale } from "@/src/data/i18n";

type Props = { compact?: boolean };

export function LanguageToggle({ compact = false }: Props) {
  const { locale, setLocale } = useApp();

  const Item = ({ code, label }: { code: Locale; label: string }) => {
    const active = locale === code;
    return (
      <TouchableOpacity
        testID={`lang-toggle-${code}`}
        onPress={() => setLocale(code)}
        style={[
          styles.item,
          compact && styles.itemCompact,
          active && styles.itemActive,
        ]}
      >
        <Text
          style={[
            styles.text,
            compact && styles.textCompact,
            active && styles.textActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <Item code="en" label="EN" />
      <Item code="fa" label="FA" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 4,
    alignSelf: "flex-start",
  },
  wrapCompact: { padding: 3 },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  itemCompact: { paddingHorizontal: 12, paddingVertical: 5 },
  itemActive: { backgroundColor: "rgba(255,255,255,0.18)" },
  text: { color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: "700", letterSpacing: 1 },
  textCompact: { fontSize: 12 },
  textActive: { color: "#FFFFFF" },
});
