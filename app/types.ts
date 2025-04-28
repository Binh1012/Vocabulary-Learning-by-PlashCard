export type Card = {
    id: string;
    word: string;
    definition: string;
    difficulty: 'easy' | 'medium' | 'hard' | null;
    note: string;
    time: string;
    isSynced?: boolean; // Optional vì chỉ dùng trong DatabaseHelper
    isDeleted?: boolean; // Optional vì chỉ dùng trong DatabaseHelper
};

export type Deck = {
    id: string;
    title: string;
    wordCount: number;
    cards: Card[];
    isSynced?: boolean; // Optional vì chỉ dùng trong DatabaseHelper
    isDeleted?: boolean; // Optional vì chỉ dùng trong DatabaseHelper
};