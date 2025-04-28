import * as SQLite from 'expo-sqlite';
import { API_URL } from '@env';
import { Deck, Card } from './types';

// Open database
const db = SQLite.openDatabaseSync('FlashCardDB.db');

// Initialize database
const initDatabase = async () => {
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Topic (
                                                 id INTEGER PRIMARY KEY,
                                                 name TEXT,
                                                 wordCount INTEGER,
                                                 isSynced INTEGER DEFAULT 0,
                                                 isDeleted INTEGER DEFAULT 0
            );
        `);
        console.log('Topic table created');

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS FlashCard (
                                                     id INTEGER PRIMARY KEY,
                                                     topicId INTEGER,
                                                     word TEXT,
                                                     meaning TEXT,
                                                     note TEXT,
                                                     time DATETIME,
                                                     lv INTEGER,
                                                     isSynced INTEGER DEFAULT 0,
                                                     isDeleted INTEGER DEFAULT 0,
                                                     FOREIGN KEY(topicId) REFERENCES Topic(id)
                );
        `);
        console.log('FlashCard table created');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
};

initDatabase().catch((error) => console.error('Failed to initialize database:', error));

// Helper functions to prevent SQL injection
const escapeString = (value: string) => `'${value.replace(/'/g, "''")}'`;
const escapeNumber = (value: number) => value.toString();

// Load all local decks
const loadLocalDecks = async (): Promise<Deck[]> => {
    try {
        const rows = await db.getAllAsync('SELECT * FROM Topic WHERE isDeleted = 0');
        const decks: Deck[] = rows.map((row: any) => ({
            id: row.id.toString(),
            title: row.name,
            wordCount: row.wordCount,
            cards: [],
            isSynced: row.isSynced === 1,
            isDeleted: row.isDeleted === 1,
        }));
        return decks;
    } catch (error) {
        console.error('Error loading decks:', error);
        throw error;
    }
};

// Get deck by ID
const getLocalDeckById = async (id: string): Promise<Deck | null> => {
    try {
        const topicRows = await db.getAllAsync(`SELECT * FROM Topic WHERE id = ${escapeNumber(parseInt(id))} AND isDeleted = 0`);
        if (topicRows.length === 0) {
            return null;
        }

        const row = topicRows[0] as any;
        const deck: Deck = {
            id: row.id.toString(),
            title: row.name,
            wordCount: row.wordCount,
            cards: [],
            isSynced: row.isSynced === 1,
            isDeleted: row.isDeleted === 1,
        };

        const cardRows = await db.getAllAsync(`SELECT * FROM FlashCard WHERE topicId = ${escapeNumber(parseInt(id))} AND isDeleted = 0`);
        const cards: Card[] = cardRows.map((cardRow: any) => ({
            id: cardRow.id.toString(),
            word: cardRow.word,
            definition: cardRow.meaning,
            difficulty: cardRow.lv === 1 ? 'easy' : cardRow.lv === 2 ? 'medium' : 'hard',
            note: cardRow.note,
            time: cardRow.time,
            isSynced: cardRow.isSynced === 1,
            isDeleted: cardRow.isDeleted === 1,
        }));

        deck.cards = cards;
        return deck;
    } catch (error) {
        console.error('Error getting deck by ID:', error);
        throw error;
    }
};

// Create new local deck
const createLocalDeck = async (title: string): Promise<Deck> => {
    try {
        const result = await db.runAsync(
            `INSERT INTO Topic (name, wordCount, isSynced) VALUES (${escapeString(title)}, 0, 0)`
        );
        const deck: Deck = {
            id: result.lastInsertRowId!.toString(),
            title,
            wordCount: 0,
            cards: [],
            isSynced: false,
            isDeleted: false,
        };
        return deck;
    } catch (error) {
        console.error('Error creating deck:', error);
        throw error;
    }
};

// Update local deck
const updateLocalDeck = async (id: string, updatedDeck: Partial<Deck>): Promise<Deck | null> => {
    try {
        await db.runAsync(
            `UPDATE Topic SET name = ${escapeString(updatedDeck.title || '')}, wordCount = ${escapeNumber(updatedDeck.wordCount || 0)}, isSynced = 0 WHERE id = ${escapeNumber(parseInt(id))}`
        );
        return await getLocalDeckById(id);
    } catch (error) {
        console.error('Error updating deck:', error);
        throw error;
    }
};

// Add new card to local deck
const addLocalCardToDeck = async (deckId: string, word: string, definition: string): Promise<Card | null> => {
    try {
        const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const result = await db.runAsync(
            `INSERT INTO FlashCard (topicId, word, meaning, note, time, lv, isSynced) VALUES (${escapeNumber(parseInt(deckId))}, ${escapeString(word)}, ${escapeString(definition)}, '', ${escapeString(time)}, 1, 0)`
        );

        const card: Card = {
            id: result.lastInsertRowId!.toString(),
            word,
            definition,
            difficulty: 'easy',
            note: '',
            time,
            isSynced: false,
            isDeleted: false,
        };

        await db.runAsync(
            `UPDATE Topic SET wordCount = wordCount + 1, isSynced = 0 WHERE id = ${escapeNumber(parseInt(deckId))}`
        );
        return card;
    } catch (error) {
        console.error('Error adding card to deck:', error);
        throw error;
    }
};

// Update local card
const updateLocalCard = async (deckId: string, cardId: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<Card | null> => {
    try {
        const lv = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
        const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
        await db.runAsync(
            `UPDATE FlashCard SET lv = ${escapeNumber(lv)}, time = ${escapeString(time)}, isSynced = 0 WHERE id = ${escapeNumber(parseInt(cardId))}`
        );
        const deck = await getLocalDeckById(deckId);
        return deck ? deck.cards.find((c) => c.id === cardId) || null : null;
    } catch (error) {
        console.error('Error updating card:', error);
        throw error;
    }
};

// Delete local deck (mark as deleted)
const deleteLocalDeck = async (id: string): Promise<void> => {
    try {
        // Mark deck as deleted in Topic table
        await db.runAsync(
            `UPDATE Topic SET isDeleted = 1, isSynced = 0 WHERE id = ${escapeNumber(parseInt(id))}`
        );

        // Mark all cards in this deck as deleted
        await db.runAsync(
            `UPDATE FlashCard SET isDeleted = 1, isSynced = 0 WHERE topicId = ${escapeNumber(parseInt(id))}`
        );
    } catch (error) {
        console.error('Error deleting deck:', error);
        throw error;
    }
};


// Delete local card (mark as deleted)
const deleteLocalCard = async (deckId: string, cardId: string): Promise<void> => {
    try {
        await db.runAsync(
            `UPDATE FlashCard SET isDeleted = 1, isSynced = 0 WHERE id = ${escapeNumber(parseInt(cardId))}`
        );
        await db.runAsync(
            `UPDATE Topic SET wordCount = wordCount - 1, isSynced = 0 WHERE id = ${escapeNumber(parseInt(deckId))}`
        );
    } catch (error) {
        console.error('Error deleting card:', error);
        throw error;
    }
};

// Sync local with server
const syncWithServer = async (): Promise<void> => {
    try {
        const localDecks = await loadLocalDecks();
        const decksToSync = localDecks.filter((deck) => !deck.isSynced);

        for (const deck of decksToSync) {
            const fullDeck = await getLocalDeckById(deck.id);
            if (!fullDeck) continue;

            if (deck.isDeleted) {
                const response = await fetch(`${API_URL}/decks/${deck.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.ok) {
                    await db.runAsync(`DELETE FROM FlashCard WHERE topicId = ${escapeNumber(parseInt(deck.id))}`);
                    await db.runAsync(`DELETE FROM Topic WHERE id = ${escapeNumber(parseInt(deck.id))}`);
                }
            } else {
                const method = fullDeck.isSynced ? 'PUT' : 'POST';
                const url = fullDeck.isSynced ? `${API_URL}/decks/${deck.id}` : `${API_URL}/decks`;
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: fullDeck.id,
                        title: fullDeck.title,
                        wordCount: fullDeck.wordCount,
                        cards: fullDeck.cards.map(card => ({
                            id: card.id,
                            word: card.word,
                            definition: card.definition,
                            difficulty: card.difficulty,
                            note: card.note,
                            time: card.time,
                        })),
                    }),
                });
                if (response.ok) {
                    await db.runAsync(
                        `UPDATE Topic SET isSynced = 1 WHERE id = ${escapeNumber(parseInt(deck.id))}`
                    );
                    await db.runAsync(
                        `UPDATE FlashCard SET isSynced = 1 WHERE topicId = ${escapeNumber(parseInt(deck.id))}`
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error syncing with server:', error);
        throw error;
    }
};

export {
    loadLocalDecks,
    getLocalDeckById,
    createLocalDeck,
    updateLocalDeck,
    addLocalCardToDeck,
    updateLocalCard,
    deleteLocalDeck,
    deleteLocalCard,
    syncWithServer,
};