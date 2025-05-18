import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>📘 About Flashcard Vocabulary</Text>
        <Text style={styles.text}>
          This app helps you memorize vocabulary efficiently through flashcards
          and mini quizzes. Build your decks, review sets, and improve your
          memory with engaging repetition.
        </Text>

        <Text style={styles.subTitle}>🛠 Technologies Used</Text>
        <Text style={styles.text}>
          React Native, Expo, Firebase Realtime DB, Expo Router
        </Text>

        <Text style={styles.subTitle}>📦 App Version</Text>
        <Text style={styles.text}>v1.0.0</Text>

        <Text style={styles.subTitle}>💬 Feedback</Text>
        <Text style={styles.text}>
          If you find any bugs or have suggestions, feel free to contact us.
        </Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("mailto:hoquylydev@gmail.com")}
        >
          📧 hoquylydev@gmail.com
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#72B3F0",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#444",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginTop: 8,
  },
  link: {
    fontSize: 16,
    color: "#F5A623",
    marginTop: 6,
    textDecorationLine: "underline",
  },
});
