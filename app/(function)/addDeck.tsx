import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useState } from 'react';
import { addDeck } from '@/api/decksApi';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/authContext';
import { DECK_IMAGES, DECK_COLORS } from '@/constants/deckVisuals';

export default function AddDeckScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [visualType, setVisualType] = useState<'image' | 'color'>('image');
    const [visualKey, setVisualKey] = useState<string>('travel');

    const handleAddDeck = async () => {
        if (!user) return Toast.show({ type: 'error', text1: 'User not authenticated.' });
        if (!deckName) return Toast.show({ type: 'error', text1: 'Deck name is required.' });

        try {
            await addDeck(user.uid, deckName, deckDescription, { type: visualType, key: visualKey });
            Toast.show({ type: 'success', text1: 'Deck added successfully!' });
            router.back();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to add deck.' });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Deck</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Choose Deck Visual</Text>
                <View style={styles.visualOptions}>
                    {DECK_IMAGES.map((img) => (
                        <TouchableOpacity
                            key={img.key}
                            onPress={() => {
                                setVisualType('image');
                                setVisualKey(img.key);
                            }}
                            style={[styles.visualOption, visualType === 'image' && visualKey === img.key && styles.selected]}
                        >
                            <Image source={img.source} style={styles.thumbnail} />
                        </TouchableOpacity>
                    ))}
                    {DECK_COLORS.map((col) => (
                        <TouchableOpacity
                            key={col.key}
                            onPress={() => {
                                setVisualType('color');
                                setVisualKey(col.key);
                            }}
                            style={[styles.visualOption, { backgroundColor: col.color }, visualType === 'color' && visualKey === col.key && styles.selectedBorder]}
                        />
                    ))}
                </View>

                <Text style={styles.label}>Deck Name</Text>
                <TextInput
                    style={styles.input}
                    value={deckName}
                    onChangeText={setDeckName}
                    placeholder="Deck Name"
                />

                <Text style={styles.label}>Deck Description</Text>
                <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    value={deckDescription}
                    onChangeText={setDeckDescription}
                    placeholder="Deck Description"
                    multiline
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleAddDeck}>
                    <Text style={styles.submitButtonText}>Add New Deck</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    header: {
        backgroundColor: '#72B3F0',
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: { fontSize: 16, color: '#fff', marginRight: 20 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    form: { marginTop: 20 },
    label: { fontSize: 16, fontWeight: 'bold', color: '#444', marginBottom: 8 },
    input: {
        borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
        padding: 10, fontSize: 16, marginBottom: 20
    },
    descriptionInput: { height: 100, textAlignVertical: 'top' },
    submitButton: {
        backgroundColor: '#72B3F0', paddingVertical: 15,
        borderRadius: 8, alignItems: 'center'
    },
    submitButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    visualOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    visualOption: {
        width: 60, height: 60, borderRadius: 8,
        borderWidth: 1, borderColor: '#ccc', overflow: 'hidden', justifyContent: 'center', alignItems: 'center'
    },
    thumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
    selected: { borderColor: '#72B3F0', borderWidth: 2 },
    selectedBorder: { borderColor: '#72B3F0', borderWidth: 2 }
});
