import { ref, get, push, set } from 'firebase/database';
import { database } from './firebaseConfig';

const decksRef = ref(database, '/decks');

interface Deck {
    id: string;
    title: string;
    cards?: { [key: string]: Card };
}

interface Card {
    id: string;
    word: string;
    meaning: string;
}

export const fetchDecks = async (): Promise<Deck[]> => {
    try {
        const snapshot = await get(decksRef);
        const decks: Deck[] = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                decks.push({
                    id: childSnapshot.key!,
                    ...childSnapshot.val(),
                });
            });
        }
        return decks;
    } catch (error) {
        console.error('Error fetching decks:', error);
        return [];
    }
};

export const addDeck = async (title: string): Promise<Deck> => {
    try {
        const newDeckRef = push(decksRef);
        await set(newDeckRef, {
            title,
        });
        return { id: newDeckRef.key!, title };
    } catch (error) {
        console.error('Error adding deck:', error);
        throw error;
    }
};

export const fetchCards = async (deckId: string): Promise<Card[]> => {
    const cardsRef = ref(database, `/decks/${deckId}/cards`);
    try {
        const snapshot = await get(cardsRef);
        const cards: Card[] = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                cards.push({
                    id: childSnapshot.key!,
                    ...childSnapshot.val(),
                });
            });
        }
        return cards;
    } catch (error) {
        console.error('Error fetching cards:', error);
        return [];
    }
};

export const addCard = async (deckId: string, word: string, meaning: string): Promise<Card> => {
    const cardsRef = ref(database, `/decks/${deckId}/cards`);
    try {
        const newCardRef = push(cardsRef);
        await set(newCardRef, {
            word,
            meaning,
        });
        return { id: newCardRef.key!, word, meaning };
    } catch (error) {
        console.error('Error adding card:', error);
        throw error;
    }
};
