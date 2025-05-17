// (function)/editCard.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";
import { updateCard } from "@/api/cardsApi";
import Toast from "react-native-toast-message";

export default function EditCardScreen() {
  const { deckId, cardId } = useLocalSearchParams<{
    deckId: string;
    cardId: string;
  }>();
  const router = useRouter();

  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [example, setExample] = useState("");

  useEffect(() => {
    const loadCard = async () => {
      if (!cardId) return;
      const snap = await get(ref(database, `cards/${cardId}`));
      if (snap.exists()) {
        const card = snap.val();
        setWord(card.word);
        setMeaning(card.meaning);
        setPartOfSpeech(card.partOfSpeech || "");
        setExample((card.examples && card.examples[0]) || "");
      }
    };
    loadCard();
  }, [cardId]);

  const handleUpdate = async () => {
    if (!word || !meaning || !cardId) return;

    try {
      await updateCard(cardId, {
        word,
        meaning,
        partOfSpeech,
        examples: [example],
      });
      Toast.show({ type: "success", text1: "Card updated" });
      router.replace({ pathname: "/(deck)/deckDetail", params: { deckId } });
    } catch (e) {
      console.error(e);
      Toast.show({ type: "error", text1: "Update failed" });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Card</Text>

        <TextInput
          style={styles.input}
          value={word}
          onChangeText={setWord}
          placeholder="Word"
        />
        <TextInput
          style={styles.input}
          value={meaning}
          onChangeText={setMeaning}
          placeholder="Meaning"
        />
        <TextInput
          style={styles.input}
          value={partOfSpeech}
          onChangeText={setPartOfSpeech}
          placeholder="Part of Speech"
        />
        <TextInput
          style={[styles.input, styles.multiInput]}
          value={example}
          onChangeText={setExample}
          placeholder="Example"
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 20, flexGrow: 1 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#72B3F0",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  multiInput: { height: 100, textAlignVertical: "top" },
  submitButton: {
    backgroundColor: "#72B3F0",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
