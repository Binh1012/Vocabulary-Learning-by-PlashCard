import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addCard } from '../apiService';

const AddCardScreen = () => {
    const router = useRouter();
    const { deckId } = useLocalSearchParams();
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');

    const handleCreateCard = async () => {
        if (!word.trim() || !meaning.trim()) {
            alert('Please enter both word and meaning');
            return;
        }
        try {
            await addCard(deckId as string, word, meaning);
            router.back();
        } catch (error) {
            console.error('Error creating card:', error);
            alert('Failed to create card');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backArrow}>◄</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Card</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Card</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Từ vựng mới"
                    placeholderTextColor="#f4a261"
                    value={word}
                    onChangeText={setWord}
                />
                <TextInput
                    style={[styles.input, styles.meaningInput]}
                    placeholder="Định nghĩa:"
                    placeholderTextColor="#f4a261"
                    value={meaning}
                    onChangeText={setMeaning}
                    multiline
                />
            </View>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateCard}>
                <Text style={styles.createButtonText}>Create new card</Text>
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
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#f4a261',
        marginBottom: 20,
    } as ViewStyle,
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    } as TextStyle,
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        color: '#000',
    },
    meaningInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    createButton: {
        backgroundColor: '#2a9d8f',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
    } as ViewStyle,
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
});

export default AddCardScreen;
