import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addCardToDeck } from '../data';

export default function NewCardScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const deckId = params.id as string;

    const [word, setWord] = useState('');
    const [definition, setDefinition] = useState('');

    const handleCreateCard = async () => {
        if (word.trim() && definition.trim()) {
            await addCardToDeck(deckId, word, definition);
            router.back();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>New Card</Text>
            <View style={styles.card}>
                <Text style={styles.label}>Card</Text>
                <TextInput
                    placeholder="Từ vựng mới"
                    style={styles.input}
                    placeholderTextColor="#FF9040"
                    value={word}
                    onChangeText={setWord}
                />
                <TextInput
                    placeholder="Định nghĩa:"
                    style={[styles.input, styles.definitionInput]}
                    placeholderTextColor="#FF9040"
                    value={definition}
                    onChangeText={setDefinition}
                    multiline
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleCreateCard}>
                <Text style={styles.buttonText}>Create new card</Text>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF9040',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#CDEAFF',
        borderRadius: 10,
        padding: 15,
        width: '100%',
        borderWidth: 2,
        borderColor: '#FF9040',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF2E3',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 10,
        color: '#FF9040',
        borderWidth: 1,
        borderColor: '#FF9040',
    },
    definitionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#5DB4F2',
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