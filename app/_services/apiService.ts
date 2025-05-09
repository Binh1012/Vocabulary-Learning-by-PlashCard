import { ref, get, push, set, remove, update } from 'firebase/database';
import { database } from './firebaseConfig';
import { getCurrentUser } from './authService';

interface Deck {
    id: string;
    title: string;
    userId: string;
    createdAt: number;
    cards?: { [key: string]: Card };
}

interface Card {
    id: string;
    word: string;
    meaning: string;
    userId: string;
    createdAt: number;
}

const getUserDecksRef = () => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return ref(database, `/users/${user.uid}/decks`);
};

const getUserCardsRef = (deckId: string) => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return ref(database, `/users/${user.uid}/decks/${deckId}/cards`);
};

export const fetchDecks = async (): Promise<Deck[]> => {
    try {
        const decksRef = getUserDecksRef();
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
        throw error;
    }
};

export const addDeck = async (title: string): Promise<Deck> => {
    try {
        const user = getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const decksRef = getUserDecksRef();
        const newDeckRef = push(decksRef);
        const deckData = {
            title,
            userId: user.uid,
            createdAt: Date.now(),
        };

        await set(newDeckRef, deckData);
        return { id: newDeckRef.key!, ...deckData };
    } catch (error) {
        console.error('Error adding deck:', error);
        throw error;
    }
};

export const updateDeck = async (deckId: string, title: string): Promise<void> => {
    try {
        const decksRef = getUserDecksRef();
        await update(ref(database, `${decksRef}/${deckId}`), { title });
    } catch (error) {
        console.error('Error updating deck:', error);
        throw error;
    }
};

export const deleteDeck = async (deckId: string): Promise<void> => {
    try {
        const decksRef = getUserDecksRef();
        await remove(ref(database, `${decksRef}/${deckId}`));
    } catch (error) {
        console.error('Error deleting deck:', error);
        throw error;
    }
};

export const fetchCards = async (deckId: string): Promise<Card[]> => {
    try {
        const cardsRef = getUserCardsRef(deckId);
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
        throw error;
    }
};

export const addCard = async (deckId: string, word: string, meaning: string): Promise<Card> => {
    try {
        const user = getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        const cardsRef = getUserCardsRef(deckId);
        const newCardRef = push(cardsRef);
        const cardData = {
            word,
            meaning,
            userId: user.uid,
            createdAt: Date.now(),
        };

        await set(newCardRef, cardData);
        return { id: newCardRef.key!, ...cardData };
    } catch (error) {
        console.error('Error adding card:', error);
        throw error;
    }
};

export const updateCard = async (deckId: string, cardId: string, word: string, meaning: string): Promise<void> => {
    try {
        const cardsRef = getUserCardsRef(deckId);
        await update(ref(database, `${cardsRef}/${cardId}`), { word, meaning });
    } catch (error) {
        console.error('Error updating card:', error);
        throw error;
    }
};

export const deleteCard = async (deckId: string, cardId: string): Promise<void> => {
    try {
        const cardsRef = getUserCardsRef(deckId);
        await remove(ref(database, `${cardsRef}/${cardId}`));
    } catch (error) {
        console.error('Error deleting card:', error);
        throw error;
    }
};
