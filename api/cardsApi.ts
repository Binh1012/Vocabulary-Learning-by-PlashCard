import { database } from "@/firebase/firebaseConfig";
import { ref, push, set, get, update, remove } from "firebase/database";

export const addCardToDeck = async (
  userId: string,
  deckId: string,
  word: string,
  meaning: string,
  partOfSpeech = "",
  examples: string[] = [],
) => {
  const cardRef = push(ref(database, "cards"));
  const cardId = cardRef.key!;
  const createdAt = Date.now();

  const cardData = {
    word,
    meaning,
    partOfSpeech,
    examples,
    userId,
    deckId, // vẫn lưu để tiện lọc
    createdAt,
  };

  await set(cardRef, cardData);

  const safeDeckId = encodeURIComponent(deckId);

  await update(ref(database, `decks/${safeDeckId}/cardIds`), {
    [cardId]: true,
  });

  // Cập nhật lại cardCount trong deck
  const deckRef = ref(database, `decks/${safeDeckId}`);
  const deckSnap = await get(deckRef);
  const currentCount = deckSnap.val()?.cardCount || 0;
  const newCount = currentCount + 1;

  // Tính subsetCount = ceil(cardCount / 30)
  const newSubsetCount = Math.ceil(newCount / 30);

  await update(deckRef, {
    cardCount: newCount,
    subsetCount: newSubsetCount, // bổ sung cập nhật subsetCount
  });

  return cardId;
};

export const fetchCardsByDeckId = async (deckId: string) => {
  const safeDeckId = encodeURIComponent(deckId);

  const deckSnap = await get(ref(database, `decks/${safeDeckId}`));
  if (!deckSnap.exists()) return [];

  const cardIds = Object.keys(deckSnap.val()?.cardIds || {});
  const cardPromises = cardIds.map(async (id) => {
    const cardSnap = await get(ref(database, `cards/${id}`));
    if (!cardSnap.exists()) return null;
    return { id, ...cardSnap.val() };
  });

  const cards = await Promise.all(cardPromises);
  return cards.filter(Boolean);
};

// export const fetchCardsByDeck = async (deckId: string) => {
//   const snapshot = await get(ref(database, "cards"));
//   if (!snapshot.exists()) return [];
//
//   const allCards = snapshot.val();
//
//   return (Object.entries(allCards) as [string, any][])
//     .filter(([id, card]) => card.deckId === deckId)
//     .map(([id, card]) => ({ id, ...card }));
// };

export const updateCard = async (
  cardId: string,
  updatedData: Partial<{
    word: string;
    meaning: string;
    partOfSpeech: string;
    examples: string[];
  }>,
) => {
  await update(ref(database, `cards/${cardId}`), updatedData);
};

// 🟥 Xoá 1 card
export const deleteCard = async (deckId: string, cardId: string) => {
  const safeDeckId = encodeURIComponent(deckId);

  // Xoá khỏi /cards
  await remove(ref(database, `cards/${cardId}`));

  // Xoá khỏi /decks/cardIds
  await remove(ref(database, `decks/${safeDeckId}/cardIds/${cardId}`));

  // Trừ cardCount
  const deckRef = ref(database, `decks/${safeDeckId}`);
  const deckSnap = await get(deckRef);
  const currentCount = deckSnap.val()?.cardCount || 0;
  const newCount = Math.max(currentCount - 1, 0);

  // Tính subsetCount = ceil(cardCount / 30)
  const newSubsetCount = Math.ceil(newCount / 30);

  await update(deckRef, {
    cardCount: newCount,
    subsetCount: newSubsetCount, // bổ sung cập nhật subsetCount
  });
};
