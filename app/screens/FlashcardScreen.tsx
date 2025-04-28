import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loadDecks, updateCard } from '../data';

export default function FlashcardScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const deckId = params.id as string;

    const [cards, setCards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const decks = await loadDecks();
            const deck = decks.find(d => d.id === deckId);
            if (deck) {
                setCards(deck.cards);
            }
        };
        loadData();
    }, []);

    const handleNextCard = () => {
        setShowDefinition(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handleDifficulty = async (difficulty: 'easy' | 'medium' | 'hard') => {
        const cardId = cards[currentIndex].id;
        await updateCard(deckId, cardId, difficulty);
        handleNextCard();
    };

    if (cards.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>No cards available!</Text>
            </View>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.card} onPress={() => setShowDefinition(!showDefinition)}>
                <Text style={styles.word}>{currentCard.word}</Text>
                {showDefinition && <Text style={styles.definition}>{currentCard.definition}</Text>}
                <TouchableOpacity style={styles.speaker}>
                    <Ionicons name="volume-high" size={24} color="white" />
                </TouchableOpacity>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.difficultyButton, { backgroundColor: '#00C853' }]} onPress={() => handleDifficulty('easy')}>
                    <Text style={styles.emoji}>😊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.difficultyButton, { backgroundColor: '#FFCA28' }]} onPress={() => handleDifficulty('medium')}>
                    <Text style={styles.emoji}>😐</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.difficultyButton, { backgroundColor: '#D81B60' }]} onPress={() => handleDifficulty('hard')}>
                    <Text style={styles.emoji}>😡</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleNextCard}>
                <Ionicons name="chevron-forward" size={24} color="#FF9040" />
                <Ionicons name="chevron-forward" size={24} color="#FF9040" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF2E3',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#CDEAFF',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    word: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF9040',
    },
    definition: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
        textAlign: 'center',
    },
    speaker: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    difficultyButton: {
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    emoji: {
        fontSize: 24,
    },
    nextButton: {
        flexDirection: 'row',
        marginTop: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF9040',
    },
});