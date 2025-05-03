import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

const SignUpScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FLASHCARD VOCABULARY</Text>
      <Text style={styles.subtitle}>Create your profile</Text>
      <TextInput style={styles.input} placeholder="Age" />
      <TextInput style={styles.input} placeholder="Name (optional)" />
      <TextInput style={styles.input} placeholder="E-mail or username" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          /* Logic sign up sẽ thêm sau */
        }}
      >
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push({ pathname: "/auth/login" as any })}
      >
        <Text style={styles.loginText}>
          Have an account? <Text style={styles.loginLink}>LOG IN</Text>
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
  loginText: {
    color: "#fff",
    marginTop: 20,
  },
  loginLink: {
    color: "#F4A261",
    fontWeight: "bold",
  },
});

export default SignUpScreen;
