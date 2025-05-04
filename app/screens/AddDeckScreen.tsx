import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { addDeck } from '../apiService';

const AddDeckScreen = () => {
    const router = useRouter();
    const [deckName, setDeckName] = useState('');

    const handleCreateDeck = async () => {
        if (!deckName.trim()) {
            alert('Please enter a deck name');
            return;
        }
        try {
            await addDeck(deckName);
            router.back();
        } catch (error) {
            console.error('Error creating deck:', error);
            alert('Failed to create deck');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>NEW DECK</Text>
            <TextInput
                style={styles.input}
                placeholder="Name of deck"
                placeholderTextColor="#f4a261"
                value={deckName}
                onChangeText={setDeckName}
            />
            <TouchableOpacity style={styles.createButton} onPress={handleCreateDeck}>
                <Text style={styles.createButtonText}>Create new deck</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#b8e1f5',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    } as TextStyle,
    input: {
        width: 100,
        backgroundColor: '#fcf4e5',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#000',
    },
    createButton: {
        backgroundColor: '#f4a261',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    } as ViewStyle,
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    } as TextStyle,
});

export default AddDeckScreen;
