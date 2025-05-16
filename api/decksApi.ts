// file: api/decksApi.ts
import { database } from '@/firebase/firebaseConfig';
import { ref, push, set, get, remove } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase Storage instance
const storage = getStorage();

/**
 * Upload ảnh từ thiết bị lên Firebase Storage
 */
export const uploadImageAsync = async (uri: string, deckId: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = storageRef(storage, `deck-images/${deckId}.jpg`);
    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
};

/**
 * Thêm deck mới với ảnh
 */
export const addDeck = async (
    userId: string,
    title: string,
    description: string,
    visual: { type: 'image' | 'color'; key: string }
) => {
    const newDeckRef = push(ref(database, 'decks'));
    const deckId = newDeckRef.key!;
    const createdAt = Date.now();

    const deckData = {
        id: deckId,
        title,
        description,
        visual,           // <<== thêm vào đây
        userId,
        createdAt,
        cardCount: 0,
        subsetCount: 0,
        cardIds: {},
    };

    await set(newDeckRef, deckData);
    await set(ref(database, `users/${userId}/decks/${deckId}`), true);

    return deckId;
};


/**
 * Lấy danh sách deck của user
 */
export const fetchDecksByUser = async (userId: string) => {
    const userDecksSnap = await get(ref(database, `users/${userId}/decks`));
    if (!userDecksSnap.exists()) return [];

    const deckIds = Object.keys(userDecksSnap.val());

    const deckPromises = deckIds.map(async (id) => {
        const deckSnap = await get(ref(database, `decks/${id}`));
        if (!deckSnap.exists()) return null;
        return { id, ...deckSnap.val() };
    });

    const decks = await Promise.all(deckPromises);
    return decks.filter(Boolean);
};

/**
 * Xoá deck
 */
export const deleteDeck = async (deckId: string, userId: string) => {
    await remove(ref(database, `decks/${deckId}`));
    await remove(ref(database, `users/${userId}/decks/${deckId}`));
};

//Hien thi thong tin trong deck
export const fetchDeckById = async (deckId: string) => {
    const deckSnap = await get(ref(database, `decks/${deckId}`));
    if (!deckSnap.exists()) throw new Error('Deck not found');
    return { id: deckId, ...deckSnap.val() };
};
