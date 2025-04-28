import NetInfo from "@react-native-community/netinfo";
import {
    loadLocalDecks,
    getLocalDeckById,
    createLocalDeck,
    updateLocalDeck,
    addLocalCardToDeck,
    updateLocalCard,
    deleteLocalDeck,
    deleteLocalCard,
    syncWithServer,
} from './DatabaseHelper';
import { API_URL } from '@env';
import { Deck, Card } from './types';

const isOnline = async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return state.isConnected || false;
};

const syncIfOnline = async () => {
    if (await isOnline()) {
        await syncWithServer();
    }
};

export const loadDecks = async (): Promise<Deck[]> => {
    if (await isOnline()) {
        try {
            const response = await fetch(`${API_URL}/decks`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch decks');
            const serverDecks = await response.json();
            await syncWithServer(); // Sync local DB with server
            return serverDecks;
        } catch (error) {
            console.error('Error loading decks from server:', error);
        }
    }
    return loadLocalDecks();
};

export const getDeckById = async (id: string): Promise<Deck | null> => {
    if (await isOnline()) {
        try {
            const response = await fetch(`${API_URL}/decks/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Failed to fetch deck');
            await syncWithServer();
            return await response.json();
        } catch (error) {
            console.error('Error loading deck from server:', error);
        }
    }
    return getLocalDeckById(id);
};

export const createDeck = async (title: string): Promise<Deck> => {
    const newDeck = await createLocalDeck(title);
    await syncIfOnline();
    return newDeck;
};

export const updateDeck = async (id: string, updatedDeck: Partial<Deck>): Promise<Deck | null> => {
    const deck = await updateLocalDeck(id, updatedDeck);
    await syncIfOnline();
    return deck;
};

export const addCardToDeck = async (deckId: string, word: string, definition: string): Promise<Card | null> => {
    const card = await addLocalCardToDeck(deckId, word, definition);
    await syncIfOnline();
    return card;
};

export const updateCard = async (deckId: string, cardId: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<Card | null> => {
    const card = await updateLocalCard(deckId, cardId, difficulty);
    await syncIfOnline();
    return card;
};

export const deleteDeck = async (id: string): Promise<void> => {
    await deleteLocalDeck(id);
    await syncIfOnline();
};

export const deleteCard = async (deckId: string, cardId: string): Promise<void> => {
    await deleteLocalCard(deckId, cardId);
    await syncIfOnline();
};