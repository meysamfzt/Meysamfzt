// Entry router. Decides where to send the user based on onboarding state.

import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useApp } from "@/src/context/AppContext";

export default function Index() {
  const { ready, onboarded } = useApp();
  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050505",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }
  return <Redirect href={onboarded ? "/(tabs)/breathwork" : "/onboarding"} />;
}
