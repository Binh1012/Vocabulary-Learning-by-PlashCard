import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { createDeck } from '../data';

export default function NewDeckScreen() {
    const router = useRouter();
    const [deckName, setDeckName] = useState('');

    const handleCreateDeck = async () => {
        if (deckName.trim()) {
            await createDeck(deckName);
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>NEW DECK</Text>
            <TextInput
                placeholder="Name of deck"
                style={styles.input}
                placeholderTextColor="#FF9040"
                value={deckName}
                onChangeText={setDeckName}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateDeck}>
                <Text style={styles.buttonText}>CREATE deck</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CDEAFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF2E3',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        color: '#FF9040',
    },
    button: {
        backgroundColor: '#FF9040',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 10,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
});