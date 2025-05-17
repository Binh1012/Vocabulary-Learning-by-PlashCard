import { fetchSampleDecks, StoreDeck } from "@/api/fetchOriginDeck";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { addDeck } from "@/api/decksApi";
import { addCardToDeck } from "@/api/cardsApi";
import { DECK_IMAGES } from "@/constants/deckVisuals";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface StoreDeck {
  id: string;
  title: string;
  description: string;
  imageKey: string;
  cards: {
    word: string;
    meaning: string;
    partOfSpeech?: string;
    examples?: string[];
  }[];
}

const { width } = Dimensions.get("window");

export default function PacksScreen() {
  const [packs, setPacks] = useState<StoreDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets(); // Lấy khoảng cách an toàn từ thanh status bar

  useEffect(() => {
    setLoading(true);
    fetchSampleDecks()
      .then(setPacks)
      .catch((error) => {
        console.error("Failed to fetch decks:", error);
        Toast.show({
          type: "error",
          text1: "Failed to load decks",
          text2: "Please try again later",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleImport = async (deck: StoreDeck) => {
    if (!user || !user.uid) {
      return Toast.show({ type: "error", text1: "Please log in" });
    }
    if (!deck.cards || deck.cards.length === 0) {
      return Toast.show({ type: "error", text1: "Deck has no cards" });
    }
    setImporting(deck.id);
    try {
      const deckId = await addDeck(user.uid, deck.title, deck.description, {
        type: "image",
        key: deck.imageKey,
      });
      await Promise.all(
        deck.cards.map((card) =>
          addCardToDeck(
            user.uid,
            deckId,
            card.word,
            card.meaning,
            card.partOfSpeech || "",
            card.examples || [],
          ),
        ),
      );
      Toast.show({ type: "success", text1: "Deck imported!" });
      router.push({ pathname: "/(deck)/deckDetail", params: { deckId } });
    } catch (error) {
      console.error("Import failed:", error);
      Toast.show({
        type: "error",
        text1: "Import failed",
        text2: error.message || "An unexpected error occurred",
      });
    } finally {
      setImporting(null);
    }
  };

  const getImage = (key: string) => {
    const img = DECK_IMAGES.find((d) => d.key === key);
    return img ? img.source : require("@/assets/images/screen/logo1.png");
  };

  const renderItem = ({ item }: { item: StoreDeck }) => (
    <View style={styles.card}>
      <Image source={getImage(item.imageKey)} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </Text>
        <Text style={styles.desc} numberOfLines={3} ellipsizeMode="tail">
          {item.description}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleImport(item)}
          disabled={importing === item.id}
        >
          <Text style={styles.buttonText}>
            {importing === item.id ? "Importing..." : "+ Add to My Decks"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeContainer, { paddingTop: insets.top }]}>
      {loading ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} color="#72B3F0" />
      ) : (
        <FlatList
          data={packs}
          keyExtractor={(item) =>
            item.id?.toString() || Math.random().toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.container}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No decks available</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxWidth: width - 32,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flexWrap: "wrap",
  },
  desc: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    flexWrap: "wrap",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#72B3F0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    padding: 20,
  },
});
