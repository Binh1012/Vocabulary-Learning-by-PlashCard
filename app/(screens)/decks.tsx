import { useRouter, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import { useState, useCallback } from "react";
import { fetchDecksByUser, deleteDeck } from "@/api/decksApi";
import Toast from "react-native-toast-message";
import { useAuth } from "@/contexts/authContext";
import { DECK_IMAGES, DECK_COLORS } from "@/constants/deckVisuals";
import { SafeAreaView } from "react-native-safe-area-context";

interface Deck {
  id: string;
  title: string;
  description?: string;
  visual?: {
    type: "image" | "color";
    key: string;
  };
  userId: string;
  cardCount?: number;
  subsetCount?: number;
  createdAt: number;
}

export default function DecksScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(true);
  const [searchText, setSearchText] = useState("");

  const loadDecks = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingDecks(true);
      const fetchedDecks = await fetchDecksByUser(user.uid);
      setDecks(fetchedDecks);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load decks.",
      });
    } finally {
      setLoadingDecks(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadDecks();
    }, [loadDecks]),
  );

  const handleDeleteDeck = async (deckId: string) => {
    if (!user) return;
    try {
      await deleteDeck(deckId, user.uid);
      setDecks(decks.filter((deck) => deck.id !== deckId));
      Toast.show({ type: "success", text1: "Deck deleted" });
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Delete failed." });
    }
  };

  const getVisualStyle = (visual?: Deck["visual"]) => {
    if (!visual) return {};

    if (visual.type === "color") {
      const colorObj = DECK_COLORS.find((c) => c.key === visual.key);
      return {
        backgroundColor: colorObj?.color || "#ccc",
      };
    }

    if (visual.type === "image") {
      const imageObj = DECK_IMAGES.find((img) => img.key === visual.key);
      if (!imageObj) return {};

      if (Platform.OS === "web") {
        return { uri: imageObj.source.uri || imageObj.source };
      }

      return {
        uri: Image.resolveAssetSource(imageObj.source).uri,
      };
    }

    return {};
  };

  const renderDeckItem = ({ item }: { item: Deck }) => {
    const visualStyle = getVisualStyle(item.visual);
    const isImage = item.visual?.type === "image";

    return (
      <View style={styles.deckItem}>
        <TouchableOpacity
          style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
          onPress={() =>
            router.push({
              pathname: `/(deck)/deckDetail`,
              params: { deckId: item.id },
            })
          }
        >
          {isImage ? (
            <Image source={{ uri: visualStyle.uri }} style={styles.deckImage} />
          ) : (
            <View
              style={[
                styles.deckImage,
                { backgroundColor: visualStyle.backgroundColor },
              ]}
            />
          )}
          <View style={styles.deckInfo}>
            <Text style={styles.deckTitle}>{item.title}</Text>
            <Text style={styles.deckSubtitle}>{item.description}</Text>
            <Text style={styles.deckMeta}>
              📄 {item.cardCount || 0} Cards 「 📂 {item.subsetCount || 0} Sets
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteDeck(item.id)}
          style={styles.deleteButton}
        >
          <Text style={{ color: "#fff" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Lọc decks theo searchText
  const filteredDecks = decks.filter((deck) =>
    deck.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  if (isLoading || loadingDecks) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#72B3F0" />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Flashcard Vocabulary</Text>
        </View>

        {/* Thanh tìm kiếm */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Tìm kiếm bộ từ..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredDecks}
          keyExtractor={(item) => item.id}
          renderItem={renderDeckItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchText
                ? "Không tìm thấy bộ từ phù hợp."
                : "Chưa có bộ từ nào."}
            </Text>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(function)/addDeck")}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#72B3F0",
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  listContent: {
    padding: 16,
  },
  deckItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deckImage: {
    width: 60,
    height: 90,
    borderRadius: 6,
    marginRight: 15,
  },
  deckInfo: {
    flex: 1,
  },
  deckTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  deckSubtitle: {
    fontSize: 14,
    color: "#777",
    marginVertical: 4,
  },
  deckMeta: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 50,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F5A623",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  fabText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});
