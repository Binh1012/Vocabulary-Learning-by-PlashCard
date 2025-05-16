// ✅ Updated addCard.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { addCardToDeck } from '@/api/cardsApi';
import { useAuth } from '@/contexts/authContext';
import Toast from 'react-native-toast-message';

export default function AddCardScreen() {
    const { deckId } = useLocalSearchParams<{ deckId: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [partOfSpeech, setPartOfSpeech] = useState('');
    const [example, setExample] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // prevent spam

    const handleAddCard = async () => {
        if (!user || !deckId || !word || !meaning) {
            Toast.show({ type: 'error', text1: 'Missing input or user' });
            return;
        }

        if (isSubmitting) return; // prevent duplicate
        setIsSubmitting(true);

        try {
            await addCardToDeck(user.uid, deckId, word, meaning, partOfSpeech, [example]);
            Toast.show({ type: 'success', text1: 'Card added' });
            setTimeout(() => {
                router.replace({ pathname: '/(deck)/deckDetail', params: { deckId } });
            }, 1000);
        } catch (error) {
            console.error("Add card error:", error);
            Toast.show({ type: 'error', text1: 'Failed to add card' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Add New Card</Text>

            <TextInput
                style={styles.input}
                placeholder="Word"
                value={word}
                onChangeText={setWord}
            />
            <TextInput
                style={styles.input}
                placeholder="Meaning"
                value={meaning}
                onChangeText={setMeaning}
            />
            <TextInput
                style={styles.input}
                placeholder="Part of Speech (e.g. noun, verb)"
                value={partOfSpeech}
                onChangeText={setPartOfSpeech}
            />
            <TextInput
                style={[styles.input, styles.multiInput]}
                placeholder="Example sentence"
                value={example}
                onChangeText={setExample}
                multiline
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddCard} disabled={isSubmitting}>
                <Text style={styles.submitButtonText}>{isSubmitting ? 'Adding...' : 'Add Card'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        flexGrow: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#72B3F0',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    multiInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#72B3F0',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
