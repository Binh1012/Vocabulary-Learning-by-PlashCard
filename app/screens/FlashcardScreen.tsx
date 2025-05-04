import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchCards } from '../apiService';

const FlashcardScreen = () => {
    const router = useRouter();
    const { deckId, deckTitle } = useLocalSearchParams();
    const [cards, setCards] = useState<{ id: string; word: string; meaning: string }[]>([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        const loadCards = async () => {
            const data = await fetchCards(deckId as string);
            setCards(data);
        };
        loadCards();
    }, [deckId]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePreviousCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const currentCard = cards[currentCardIndex];

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.vocabIcon}
                onPress={() => router.push({ pathname: '/screens/VocabularyListScreen', params: { deckId, deckTitle } })}
            >
                <Text style={styles.vocabIconText}>📚</Text>
            </TouchableOpacity>
            {cards.length > 0 ? (
                <TouchableOpacity style={styles.card} onPress={handleFlip}>
                    <Text style={styles.cardText}>{isFlipped ? currentCard.meaning : currentCard.word}</Text>
                    <Text style={styles.cardLabel}>(n)</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.noCardsText}>No cards available</Text>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.emojiButton}>
                    <Text style={styles.emojiText}>😊</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.emojiButton}>
                    <Text style={styles.emojiText}>😐</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.emojiButton}>
                    <Text style={styles.emojiText}>😡</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.navigationButtons}>
                <TouchableOpacity onPress={handlePreviousCard}>
                    <Text style={styles.navArrow}>◄◄</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNextCard}>
                    <Text style={styles.navArrow}>►►</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcf4e5',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    vocabIcon: {
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
    } as ViewStyle,
    vocabIconText: {
        fontSize: 30,
        color: '#f4a261',
    } as TextStyle,
    card: {
        backgroundColor: '#b8e1f5',
        width: '100%',
        height: 200,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    } as ViewStyle,
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f4a261',
    } as TextStyle,
    cardLabel: {
        fontSize: 16,
        color: '#fff',
    } as TextStyle,
    noCardsText: {
        fontSize: 18,
        color: '#f4a261',
    } as TextStyle,
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    } as ViewStyle,
    emojiButton: {
        backgroundColor: '#b8e1f5',
        padding: 10,
        borderRadius: 50,
    } as ViewStyle,
    emojiText: {
        fontSize: 30,
    } as TextStyle,
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%',
    } as ViewStyle,
    navArrow: {
        fontSize: 30,
        color: '#f4a261',
    } as TextStyle,
});

export default FlashcardScreen;
