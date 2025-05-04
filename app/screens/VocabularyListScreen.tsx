import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchCards } from '../apiService';

const VocabularyListScreen = () => {
    const router = useRouter();
    const { deckId, deckTitle } = useLocalSearchParams();
    const [cards, setCards] = useState<{ id: string; word: string; meaning: string }[]>([]);

    useEffect(() => {
        const loadCards = async () => {
            const data = await fetchCards(deckId as string);
            setCards(data);
        };
        loadCards();
    }, [deckId]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backArrow}>◄</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{deckTitle}</Text>
            </View>
            {cards.map((card) => (
                <View key={card.id} style={styles.card}>
                    <Text style={styles.word}>{card.word} (v)</Text>
                    <Text style={styles.meaning}>Định nghĩa: {card.meaning}</Text>
                </View>
            ))}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push({ pathname: '/screens/AddCardScreen', params: { deckId } })}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcf4e5',
        padding: 20,
    } as ViewStyle,
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    } as ViewStyle,
    backArrow: {
        fontSize: 30,
        color: '#f4a261',
        marginRight: 10,
    } as TextStyle,
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f4a261',
    } as TextStyle,
    card: {
        backgroundColor: '#b8e1f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    } as ViewStyle,
    word: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    } as TextStyle,
    meaning: {
        fontSize: 14,
        color: '#000',
    } as TextStyle,
    addButton: {
        backgroundColor: '#2a9d8f',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    } as ViewStyle,
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    } as TextStyle,
});

export default VocabularyListScreen;
