import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FLASHCARD VOCABULARY</Text>
      <Text style={styles.subtitle}>Log in</Text>
      <TextInput style={styles.input} placeholder="E-mail or username" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* Logic login sẽ thêm sau */
        }}
      >
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push({ pathname: "/(auth)/signup" as any })}
      >
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>SIGN UP</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5E1",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#00AEEF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#00AEEF",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#D9F0FF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#F4A261",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  signupText: {
    color: "#fff",
    marginTop: 20,
  },
  signupLink: {
    color: "#F4A261",
    fontWeight: "bold",
  },
});

export default LoginScreen;
