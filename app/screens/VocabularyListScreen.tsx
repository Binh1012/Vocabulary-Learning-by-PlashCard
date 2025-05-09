import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { fetchCards, deleteCard } from '@/app/_services/apiService';
import Toast from 'react-native-toast-message';

interface Card {
    id: string;
    word: string;
    meaning: string;
    userId: string;
    createdAt: number;
}

const VocabularyListScreen = () => {
    const router = useRouter();
    const { deckId } = useLocalSearchParams();
    const [cards, setCards] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCards = useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedCards = await fetchCards(deckId as string);
            setCards(fetchedCards);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to load cards. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }, [deckId]);

    // Tải lại danh sách card mỗi khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            loadCards();
        }, [loadCards])
    );

    const handleDeleteCard = async (cardId: string) => {
        try {
            await deleteCard(deckId as string, cardId);
            setCards(cards.filter((card) => card.id !== cardId));
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Card deleted successfully',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete card. Please try again.',
            });
        }
    };

    const renderCardItem = ({ item }: { item: Card }) => (
        <View style={styles.cardItem}>
            <View style={styles.cardContent}>
                <Text style={styles.word}>{item.word}</Text>
                <Text style={styles.meaning}>{item.meaning}</Text>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteCard(item.id)}
                style={styles.deleteButton}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Vocabulary List</Text>
                <TouchableOpacity
                    onPress={() => router.push(`/screens/AddCardScreen?deckId=${deckId}`)}
                    style={styles.addButton}
                >
                    <Image source={require('../../assets/images/deck_card.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading cards...</Text>
                ) : cards.length === 0 ? (
                    <Text style={styles.emptyText}>No cards available. Add some!</Text>
                ) : (
                    <FlatList
                        data={cards}
                        renderItem={renderCardItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
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
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#ff884d',
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#72b3f0',
    },
    addButton: {
        padding: 8,
    },
    arrowIcon: {
        width: 24,
        height: 24,
        tintColor: '#ff884d',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    cardContent: {
        flex: 1,
    },
    word: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#72b3f0',
        marginBottom: 5,
    },
    meaning: {
        fontSize: 16,
        color: '#666',
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default VocabularyListScreen;
