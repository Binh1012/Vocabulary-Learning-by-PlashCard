import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { updateDeck } from '../data';

export default function DeckDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [title, setTitle] = useState(params.title as string || '');
    const [wordCount, setWordCount] = useState(String(params.wordCount || ''));

    const handleSave = async () => {
        await updateDeck(params.id as string, { title, wordCount: Number(wordCount) });
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>
                EDIT DECK{'\n'}
            </Text>
            <Text style={styles.header}>Update your deck</Text>

            <TextInput
                placeholder="Deck title"
                style={styles.input}
                placeholderTextColor="#FF9040"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                placeholder="Word count"
                style={styles.input}
                placeholderTextColor="#FF9040"
                keyboardType="numeric"
                value={wordCount}
                onChangeText={setWordCount}
                editable={false} // Word count sẽ được tự động cập nhật từ số card
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push({
                    pathname: '/screens/NewCardScreen',
                    params: { id: params.id },
                })}
            >
                <Text style={styles.buttonText}>ADD CARD</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push({
                    pathname: '/screens/FlashcardScreen',
                    params: { id: params.id },
                })}
            >
                <Text style={styles.buttonText}>START LEARNING</Text>
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
    logo: {
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#5DB4F2',
    },
    header: {
        marginTop: 30,
        fontSize: 18,
        color: '#5DB4F2',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#CDEAFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 15,
        color: '#FF9040',
    },
    button: {
        marginTop: 20,
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