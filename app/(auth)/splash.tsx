import React, { useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({ pathname: "/(auth)/login" as any });
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({ pathname: "/(auth)/login" as any })}
    >
      <Image
        source={require("../../assets/images/logo1.png")}
        style={styles.logo}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});

export default SplashScreen;
