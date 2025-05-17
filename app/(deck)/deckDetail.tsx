import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { fetchDeckById } from "@/api/decksApi";
import { deleteCard, fetchCardsByDeckId } from "@/api/cardsApi";
import { Tabs } from "react-native-collapsible-tab-view";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

interface Deck {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  cardCount?: number;
  subsetCount?: number;
}

interface Card {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech?: string;
  examples?: string[];
  userId: string;
  deckId: string;
  createdAt: number;
}

export default function DeckDetailScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [cardSets, setCardSets] = useState<Card[][]>([]);

  useEffect(() => {
    if (!deckId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [deckData, cardData] = await Promise.all([
          fetchDeckById(deckId),
          fetchCardsByDeckId(deckId),
        ]);
        setDeck(deckData);
        setCards(cardData);

        const sets: Card[][] = [];
        for (let i = 0; i < cardData.length; i += 30) {
          sets.push(cardData.slice(i, i + 30));
        }
        setCardSets(sets);
      } catch (e) {
        console.error("Failed to load deck or cards", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [deckId]);

  const handleDelete = async (cardId: string) => {
    if (!deckId) return;
    try {
      await deleteCard(deckId, cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      Toast.show({ type: "success", text1: "Card deleted" });
    } catch (err) {
      console.error("Delete failed", err);
      Toast.show({ type: "error", text1: "Failed to delete card" });
    }
  };

  if (loading || !deck) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#72B3F0" />
    );
  }

  const renderSetBox = () =>
    cardSets.map((set, index) => (
      <TouchableOpacity
        key={index}
        style={styles.cardBox}
        onPress={() =>
          router.push({
            pathname: "/(deck)/(subset)/flashCard",
            params: {
              deckId,
              setIndex: index.toString(),
              preloadedCards: JSON.stringify(cards),
            },
          })
        }
      >
        <Text style={styles.cardBoxText}>Set {index + 1}</Text>
        <Text style={styles.cardBoxSub}>🧠 {set.length} cards</Text>
      </TouchableOpacity>
    ));

  const renderCardBox = () =>
    cards.map((card) => (
      <View key={card.id} style={styles.cardBox}>
        <Text style={styles.word}>{card.word}</Text>
        <Text style={styles.meaning}>{card.meaning}</Text>
        {card.partOfSpeech && (
          <Text style={styles.part}>{card.partOfSpeech}</Text>
        )}

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(function)/editCard",
                params: { deckId: deck.id, cardId: card.id },
              })
            }
            style={[styles.smallButton, { backgroundColor: "#72B3F0" }]}
          >
            <Text style={styles.smallButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(card.id)}
            style={[
              styles.smallButton,
              { backgroundColor: "#ff4d4d", marginLeft: 10 },
            ]}
          >
            <Text style={styles.smallButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs.Container
        headerContainerStyle={styles.headerContainer}
        renderHeader={() => (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.deckInfo}>
              <Image source={{ uri: deck.imageUrl }} style={styles.image} />
              <View>
                <Text style={styles.deckTitle}>{deck.title}</Text>
                <Text style={styles.deckDescription}>{deck.description}</Text>
                <Text style={styles.deckMeta}>
                  📄 {cards.length} Cards ｜ 📂{" "}
                  {deck.subsetCount || cardSets.length} Sets
                </Text>
              </View>
            </View>
          </View>
        )}
      >
        <Tabs.Tab name="Sets" label="Sets">
          <Tabs.ScrollView contentContainerStyle={{ padding: 16 }}>
            {cardSets.length === 0 ? (
              <Text style={styles.emptyText}>No sets available.</Text>
            ) : (
              renderSetBox()
            )}
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Cards" label="Cards">
          <Tabs.ScrollView contentContainerStyle={{ padding: 16 }}>
            {cards.length === 0 ? (
              <Text style={styles.emptyText}>This deck has no cards yet.</Text>
            ) : (
              renderCardBox()
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                router.push({
                  pathname: "/(function)/addCard",
                  params: { deckId },
                })
              }
            >
              <Text style={styles.addButtonText}>+ Add New Card</Text>
            </TouchableOpacity>
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Quiz" label="Quiz">
          <Tabs.ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text>Quiz coming soon...</Text>
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { backgroundColor: "#fff" },
  header: { padding: 16, backgroundColor: "#fff" },
  backButton: { marginBottom: 10 },
  backText: { color: "#72B3F0", fontSize: 16 },
  deckInfo: { flexDirection: "row", gap: 10 },
  image: { width: 60, height: 60, borderRadius: 8 },
  deckTitle: { fontSize: 20, fontWeight: "bold" },
  deckDescription: { color: "#666" },
  deckMeta: { marginTop: 4, fontSize: 14, color: "#999" },

  cardBox: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBoxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardBoxSub: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#72B3F0",
  },
  meaning: {
    fontSize: 16,
    color: "#444",
  },
  part: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#888",
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  smallButtonText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#F5A623",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
