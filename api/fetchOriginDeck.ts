import { get, ref } from "firebase/database";
import { database } from "@/firebase/firebaseConfig";

export interface StoreCard {
  word: string;
  meaning: string;
  partOfSpeech?: string;
  examples?: string[];
}

export interface StoreDeck {
  id: string;
  title: string;
  description: string;
  imageKey: string;
  cards: StoreCard[];
}

export const fetchSampleDecks = async (): Promise<StoreDeck[]> => {
  const snapshot = await get(ref(database, "sampleDecks"));
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.entries(data).map(([id, deck]: any) => ({
    id,
    title: deck.title,
    description: deck.description,
    imageKey: deck.imageKey,
    cards: Object.values(deck.cards || {}),
  }));
};
