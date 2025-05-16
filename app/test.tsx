// app/test.tsx
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { addDeck, fetchDecksByUser } from '@/api/decksApi';
import { addCardToDeck, fetchCardsByDeckId } from '@/api/cardsApi';

const TestScreen = () => {
    const userId = 'abc123'; // test UID tạm

    const handleTest = async () => {
        const deckId = await addDeck(userId, 'Test Deck');
        console.log('Created Deck:', deckId);

        const cardId = await addCardToDeck(userId, deckId, '안녕하세요', 'Hello');
        console.log('Added Card:', cardId);

        const decks = await fetchDecksByUser(userId);
        console.log('User Decks:', decks);

        const cards = await fetchCardsByDeckId(deckId);
        console.log('Deck Cards:', cards);
    };

    return (
        <View style={{ marginTop: 60 }}>
            <Text>Test Firebase Logic</Text>
            <Button title="Run Test" onPress={handleTest} />
        </View>
    );
};

export default TestScreen;
