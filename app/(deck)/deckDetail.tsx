import {router, useLocalSearchParams} from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { fetchDeckById } from '@/api/decksApi';
import {fetchCardsByDeckId} from "@/api/cardsApi";
import { Tabs } from 'react-native-collapsible-tab-view';

interface Deck {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    cardCount?: number;
    subsetCount?: number;
}

interface Card {
    id: string;
    word: string;
    meaning: string;
    partOfSpeech?: string;
    examples?: string[];
    userId: string;
    deckId: string;
    createdAt: number;
}


export default function DeckDetailScreen() {
    const { deckId } = useLocalSearchParams<{ deckId: string }>();
    const [deck, setDeck] = useState<Deck | null>(null);
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<Card[]>([]);

    useEffect(() => {
        if (!deckId) return;

        const loadDeck = async () => {
            try {
                const data = await fetchDeckById(deckId);
                setDeck(data);
            } catch (e) {
                console.error('Failed to load deck', e);
            } finally {
                setLoading(false);
            }
        };

        loadDeck();
    }, [deckId]);

    useEffect(() => {
        if (!deckId) return;

        const loadCards = async () => {
            try {
                const result = await fetchCardsByDeckId(deckId); // HÀM NÀY ĐÃ VIẾT TRONG cardsApi.ts
                setCards(result);
            } catch (e) {
                console.error('Failed to load cards', e);
            }
        };

        loadCards();
    }, [deckId]);


    if (loading || !deck) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#72B3F0" />;
    }

    return (
        <Tabs.Container
            headerContainerStyle={styles.headerContainer}
            renderHeader={() => (
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                    <View style={styles.deckInfo}>
                        <Image source={{ uri: deck.imageUrl }} style={styles.image} />
                        <View>
                            <Text style={styles.deckTitle}>{deck.title}</Text>
                            <Text style={styles.deckDescription}>{deck.description}</Text>
                            <Text style={styles.deckMeta}>
                                📄 {deck.cardCount || 0} Cards ｜ 📂 {deck.subsetCount || 0} Subsets
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        >
            <Tabs.Tab name="Sets" label="Sets">
                <Tabs.ScrollView contentContainerStyle={{ padding: 16 }}>
                    <Text>Sets (33) – UI sẽ xây sau</Text>
                </Tabs.ScrollView>
            </Tabs.Tab>

            <Tabs.Tab name="Cards" label="Cards">
                <Tabs.ScrollView contentContainerStyle={{ padding: 16 }}>
                    {cards.length === 0 ? (
                        <Text style={styles.emptyText}>This deck has no cards yet.</Text>
                    ) : (
                        cards.map((card) => (
                            <View key={card.id} style={styles.cardBox}>
                                <Text style={styles.word}>{card.word}</Text>
                                <Text style={styles.meaning}>{card.meaning}</Text>
                                {card.partOfSpeech && <Text style={styles.part}>{card.partOfSpeech}</Text>}
                            </View>
                        ))
                    )}

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push(`/(function)/addCard?deckId=${deck.id}`)}
                    >
                        <Text style={styles.addButtonText}>+ Add New Card</Text>
                    </TouchableOpacity>
                </Tabs.ScrollView>
            </Tabs.Tab>


            <Tabs.Tab name="Quiz" label="Quiz">
                <Tabs.ScrollView contentContainerStyle={{ padding: 16 }}>
                    <Text>Quiz coming soon...</Text>
                </Tabs.ScrollView>
            </Tabs.Tab>
        </Tabs.Container>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fcf4e5',
    },
    header: {
        padding: 16,
        backgroundColor: '#72B3F0',
    },
    backButton: {
        marginBottom: 10,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
    },
    deckInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 90,
        borderRadius: 6,
        marginRight: 16,
    },
    deckTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    deckDescription: {
        color: '#fff',
        marginVertical: 4,
    },
    deckMeta: {
        color: '#fff',
    },
    cardBox: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    word: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#72B3F0',
    },
    meaning: {
        fontSize: 16,
        color: '#444',
    },
    part: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
    },
    emptyText: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
    addButton: {
        backgroundColor: '#F5A623',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },

});
