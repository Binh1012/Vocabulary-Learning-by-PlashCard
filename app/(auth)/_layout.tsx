import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      {/* Định nghĩa các màn hình trong nhóm (auth) */}
      <Stack.Screen name="(auth)/splash" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ title: "Đăng Nhập" }} />
      <Stack.Screen name="(auth)/signup" options={{ title: "Đăng Ký" }} />
    </Stack>
  );
}
