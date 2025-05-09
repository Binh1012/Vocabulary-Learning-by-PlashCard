import { useRouter, useFocusEffect } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { fetchDecks, deleteDeck } from '@/app/_services/apiService';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/app/_contexts/AuthContext';

interface Deck {
    id: string;
    title: string;
    userId: string;
    createdAt: number;
}

const HomeScreen = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [decks, setDecks] = useState<Deck[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadDecks = useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedDecks = await fetchDecks();
            setDecks(fetchedDecks);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load decks. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Tải lại danh sách deck mỗi khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            if (user) {
                loadDecks();
            }
        }, [user, loadDecks])
    );

    const handleDeleteDeck = async (deckId: string) => {
        try {
            await deleteDeck(deckId);
            setDecks(decks.filter((deck) => deck.id !== deckId));
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Deck deleted successfully',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete deck. Please try again.',
            });
        }
    };

    const renderDeckItem = ({ item }: { item: Deck }) => (
        <View style={styles.deckItem}>
            <Text style={styles.deckTitle}>{item.title}</Text>
            <View style={styles.deckActions}>
                <TouchableOpacity
                    onPress={() => router.push(`/screens/FlashcardScreen?deckId=${item.id}`)}
                    style={styles.actionButton}
                >
                    <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push(`/screens/VocabularyListScreen?deckId=${item.id}`)}
                    style={styles.actionButton}
                >
                    <Text style={styles.actionButtonText}>List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteDeck(item.id)}
                    style={[styles.actionButton, styles.deleteButton]}
                >
                    <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Please log in to view your decks.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Decks</Text>
                <TouchableOpacity
                    onPress={() => router.push('/screens/AddDeckScreen')}
                    style={styles.addButton}
                >
                    <Image source={require('../../assets/images/Fast Forward.png')} style={styles.arrowIcon} />
                    <Text style={styles.addButtonText}>Add Deck</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={decks}
                renderItem={renderDeckItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No decks available. Add a new deck!</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcf4e5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#72b3f0',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff884d',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
        marginRight: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 20,
    },
    deckItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    deckTitle: {
        fontSize: 18,
        color: '#72b3f0',
        marginBottom: 10,
    },
    deckActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: '#ff884d',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#ff4d4d',
        textAlign: 'center',
        padding: 20,
    },
});

export default HomeScreen;
