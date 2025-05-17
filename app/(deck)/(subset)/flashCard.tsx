import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchCardsByDeckId } from "@/api/cardsApi";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

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

function FlashCardScreen() {
  const { deckId, setIndex, preloadedCards } = useLocalSearchParams<{
    deckId: string;
    setIndex: string;
    preloadedCards?: string;
  }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    const loadSet = async () => {
      if (!deckId || setIndex === undefined) return;

      let allCards: Card[] = [];
      if (preloadedCards) {
        allCards = JSON.parse(preloadedCards);
      } else {
        allCards = await fetchCardsByDeckId(deckId);
      }

      const index = parseInt(setIndex);
      const sets: Card[][] = [];
      for (let i = 0; i < allCards.length; i += 30) {
        sets.push(allCards.slice(i, i + 30));
      }
      setCards(sets[index] || []);
    };

    loadSet();
  }, [deckId, setIndex, preloadedCards]);

  const handleFlip = useCallback(() => {
    const newRotation = rotation.value === 0 ? 180 : 0;
    rotation.value = withTiming(newRotation, { duration: 300 });
  }, [rotation]);

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      rotation.value = 0;
    }
  }, [currentIndex, cards.length, rotation]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      rotation.value = 0;
    }
  }, [currentIndex, rotation]);

  const currentCard = useMemo(() => cards[currentIndex], [cards, currentIndex]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${rotation.value}deg`;
    return {
      transform: [{ perspective: 1000 }, { rotateY }],
      opacity: interpolate(rotation.value, [0, 90], [1, 0]),
      backfaceVisibility: "hidden",
      position: "absolute",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = `${rotation.value + 180}deg`;
    return {
      transform: [{ perspective: 1000 }, { rotateY }],
      opacity: interpolate(rotation.value, [90, 180], [0, 1]),
      backfaceVisibility: "hidden",
      position: "absolute",
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    };
  });

  if (cards.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No cards in this set.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFlip} activeOpacity={1}>
          <View style={styles.card}>
            <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
              <Text style={styles.word}>{currentCard.word}</Text>
            </Animated.View>
            <Animated.View style={[styles.cardFace, backAnimatedStyle]}>
              <Text style={styles.meaning}>{currentCard.meaning}</Text>
              {currentCard.partOfSpeech && (
                <Text style={styles.part}>{currentCard.partOfSpeech}</Text>
              )}
              {currentCard.examples && currentCard.examples.length > 0 && (
                <Text style={styles.example}>
                  Eg: {currentCard.examples[0]}
                </Text>
              )}
            </Animated.View>
          </View>
        </TouchableOpacity>

        <View style={styles.navRow}>
          <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
            <Text
              style={[
                styles.navBtn,
                currentIndex === 0 && styles.navBtnDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>
          <Text style={styles.counter}>
            {currentIndex + 1} / {cards.length}
          </Text>
          <TouchableOpacity
            onPress={handleNext}
            disabled={currentIndex === cards.length - 1}
          >
            <Text
              style={[
                styles.navBtn,
                currentIndex === cards.length - 1 && styles.navBtnDisabled,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fcf4e5",
    justifyContent: "center",
  },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: "#72B3F0",
    padding: 10,
    borderRadius: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 300,
    width: width - 40,
    alignSelf: "center",
    overflow: "hidden",
  },
  cardFace: {
    position: "absolute",
    padding: 24,
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  word: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#72B3F0",
    textAlign: "center",
  },
  meaning: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  part: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },
  example: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  navBtn: {
    fontSize: 16,
    color: "#72B3F0",
    fontWeight: "bold",
  },
  navBtnDisabled: {
    color: "#ccc",
  },
  counter: {
    fontSize: 16,
    color: "#555",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
  },
});

export default FlashCardScreen;
