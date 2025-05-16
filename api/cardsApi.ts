import { database } from '@/firebase/firebaseConfig';
import { ref, push, set, get, update } from 'firebase/database';

export const addCardToDeck = async (
    userId: string,
    deckId: string,
    word: string,
    meaning: string,
    partOfSpeech = '',
    examples: string[] = []
) => {
    const cardRef = push(ref(database, 'cards'));
    const cardId = cardRef.key!;
    const createdAt = Date.now();

    const cardData = {
        word,
        meaning,
        partOfSpeech,
        examples,
        userId,
        deckId, // ✅ cần để fetchCardsByDeck hoạt động
        createdAt,
    };

    await set(cardRef, cardData);

    // Gắn cardId vào decks/<deckId>/cardIds
    await update(ref(database, `decks/${deckId}/cardIds`), {
        [cardId]: true,
    });

    // ✅ Lấy và cập nhật lại cardCount trong deck
    const deckRef = ref(database, `decks/${deckId}`);
    const deckSnap = await get(deckRef);
    const currentCount = deckSnap.val()?.cardCount || 0;

    await update(deckRef, {
        cardCount: currentCount + 1,
    });

    return cardId;
};

export const fetchCardsByDeckId = async (deckId: string) => {
    const deckSnap = await get(ref(database, `decks/${deckId}`));
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

export const fetchCardsByDeck = async (deckId: string) => {
    const snapshot = await get(ref(database, 'cards'));
    if (!snapshot.exists()) return [];

    const allCards = snapshot.val();

    return (Object.entries(allCards) as [string, any][])
        .filter(([id, card]) => card.deckId === deckId)
        .map(([id, card]) => ({ id, ...card }));
};


