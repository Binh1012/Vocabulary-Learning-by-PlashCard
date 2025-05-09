import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { fetchCards } from '@/app/_services/apiService';
import Toast from 'react-native-toast-message';

interface Card {
    id: string;
    word: string;
    meaning: string;
}

const FlashcardScreen = () => {
    const router = useRouter();
    const { deckId } = useLocalSearchParams();
    const [cards, setCards] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const flipAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();

        const loadCards = async () => {
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
        };

        loadCards();
    }, [deckId]);

    const flipCard = () => {
        setIsFlipped(!isFlipped);
        Animated.spring(flipAnim, {
            toValue: isFlipped ? 0 : 180,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            flipAnim.setValue(0);
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            flipAnim.setValue(0);
            setCurrentIndex(currentIndex - 1);
        }
    };

    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnim.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    };

    const backAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnim.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['180deg', '360deg'],
                }),
            },
        ],
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Flashcards</Text>
                <TouchableOpacity
                    onPress={() => router.push(`/screens/VocabularyListScreen?deckId=${deckId}`)}
                    style={styles.listButton}
                >
                    <Text style={styles.listButtonText}>List</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {isLoading ? (
                    <Text style={styles.loadingText}>Loading cards...</Text>
                ) : cards.length === 0 ? (
                    <Text style={styles.emptyText}>No cards available. Add some!</Text>
                ) : (
                    <>
                        <View style={styles.cardContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={flipCard}
                                style={styles.card}
                            >
                                <Animated.View style={[styles.cardFace, frontAnimatedStyle]}>
                                    <Text style={styles.cardText}>{cards[currentIndex].word}</Text>
                                </Animated.View>
                                <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
                                    <Text style={styles.cardText}>{cards[currentIndex].meaning}</Text>
                                </Animated.View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.navigation}>
                            <TouchableOpacity
                                onPress={previousCard}
                                style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                                disabled={currentIndex === 0}
                            >
                                <Text style={styles.navButtonText}>Previous</Text>
                            </TouchableOpacity>
                            <Text style={styles.cardCount}>
                                {currentIndex + 1} / {cards.length}
                            </Text>
                            <TouchableOpacity
                                onPress={nextCard}
                                style={[styles.navButton, currentIndex === cards.length - 1 && styles.navButtonDisabled]}
                                disabled={currentIndex === cards.length - 1}
                            >
                                <Text style={styles.navButtonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </Animated.View>
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
    listButton: {
        padding: 8,
    },
    listButtonText: {
        color: '#ff884d',
        fontSize: 16,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cardContainer: {
        width: Dimensions.get('window').width - 40,
        height: 400,
        perspective: '1000', // Sửa từ 1000 (number) thành "1000" (string)
    },
    card: {
        flex: 1,
        position: 'relative',
    },
    cardFace: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardBack: {
        backgroundColor: '#b8e1f5',
    },
    cardText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#72b3f0',
        textAlign: 'center',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
    },
    navButton: {
        backgroundColor: '#ff884d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    navButtonDisabled: {
        backgroundColor: '#ffb38a',
        opacity: 0.7,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardCount: {
        fontSize: 16,
        color: '#666',
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

export default FlashcardScreen;
