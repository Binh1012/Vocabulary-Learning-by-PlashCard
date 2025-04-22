import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
            name="screens/StartScreen"
            options={{ title: "Welcome", headerShown: false }}
        />
        <Stack.Screen
            name="screens/LoginScreen"
            options={{ title: "Login", headerShown: false }}
        />
        <Stack.Screen
            name="screens/SignUpScreen"
            options={{ title: "Sign Up", headerShown: false }}
        />
        <Stack.Screen
              name="screens/DashboardScreen"
              options={{ title: "Dashboard", headerShown: false }}
        />
      </Stack>
  );
}
