// Bottom tab navigation with custom frosted-glass floating bar.

import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/src/context/AppContext";
import { isRTL, t } from "@/src/data/i18n";

const TAB_ROUTES = [
  { name: "breathwork", icon: "wind" as const, label: "tab_breathwork" },
  { name: "meditation", icon: "circle" as const, label: "tab_meditation" },
  { name: "profile", icon: "user" as const, label: "tab_profile" },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { locale } = useApp();
  const rtl = isRTL(locale);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // custom bar via tabBar prop
        sceneStyle: { backgroundColor: "#050505" },
      }}
      tabBar={({ state, navigation }) => {
        return (
          <View
            pointerEvents="box-none"
            style={[
              styles.barWrap,
              {
                paddingBottom: Math.max(insets.bottom, 12),
                flexDirection: rtl ? "row-reverse" : "row",
              },
            ]}
          >
            <BlurView
              intensity={Platform.OS === "ios" ? 80 : 60}
              tint="dark"
              style={styles.bar}
            >
              <View
                style={[
                  styles.barInner,
                  { flexDirection: rtl ? "row-reverse" : "row" },
                ]}
              >
                {TAB_ROUTES.map((r, idx) => {
                  const focused = state.index === idx;
                  const onPress = () => {
                    const ev = navigation.emit({
                      type: "tabPress",
                      target: state.routes[idx].key,
                      canPreventDefault: true,
                    });
                    if (!focused && !ev.defaultPrevented) {
                      navigation.navigate(state.routes[idx].name);
                    }
                  };
                  return (
                    <TouchableOpacity
                      key={r.name}
                      testID={`tab-${r.name}`}
                      onPress={onPress}
                      style={styles.tabItem}
                      activeOpacity={0.85}
                    >
                      <View
                        style={[
                          styles.tabIconWrap,
                          focused && styles.tabIconWrapActive,
                        ]}
                      >
                        <Feather
                          name={r.icon}
                          size={20}
                          color={focused ? "#FFFFFF" : "rgba(255,255,255,0.6)"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.tabLabel,
                          focused && styles.tabLabelActive,
                        ]}
                      >
                        {t(locale, r.label)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BlurView>
          </View>
        );
      }}
    >
      <Tabs.Screen name="breathwork" />
      <Tabs.Screen name="meditation" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
  },
  bar: {
    flex: 1,
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(10,10,10,0.55)",
  },
  barInner: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  tabIconWrap: {
    width: 40,
    height: 30,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIconWrapActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  tabLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  tabLabelActive: { color: "#FFFFFF" },
});
