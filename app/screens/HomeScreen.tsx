import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchDecks } from '../apiService';

const HomeScreen = () => {
    const router = useRouter();
    const [decks, setDecks] = useState<{ id: string; title: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadDecks = async () => {
            const data = await fetchDecks();
            setDecks(data);
        };
        loadDecks();
    }, []);

    const filteredDecks = decks.filter((deck) =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeckPress = (deckId: string, deckTitle: string) => {
        router.push({ pathname: '/screens/FlashcardScreen', params: { deckId, deckTitle } });
    };

    return (
        <View style={styles.container}>
            {/* Menu và Cài đặt */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Image source={require('../../assets/images/menu.png')} style={styles.icon as StyleProp<ImageStyle>} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={require('../../assets/images/setting.png')} style={styles.icon as StyleProp<ImageStyle>} />
                </TouchableOpacity>
            </View>

            {/* Thanh tìm kiếm */}
            <TextInput
                style={styles.searchBar}
                placeholder="Find decks"
                placeholderTextColor="#f4a261"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Danh sách decks */}
            {filteredDecks.map((deck) => (
                <TouchableOpacity
                    key={deck.id}
                    style={styles.deckCard}
                    onPress={() => handleDeckPress(deck.id, deck.title)}
                >
                    <Text style={styles.deckTitle}>{deck.title}</Text>
                </TouchableOpacity>
            ))}

            {/* Nút thêm deck */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/screens/AddDeckScreen')}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcf4e5',
        padding: 20,
    } as ViewStyle,
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    } as ViewStyle,
    icon: {
        width: 24,
        height: 24,
        tintColor: '#f4a261',
    } as ImageStyle,
    searchBar: {
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#f4a261',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    deckCard: {
        backgroundColor: '#2a9d8f',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    } as ViewStyle,
    deckTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    } as TextStyle,
    addButton: {
        backgroundColor: '#2a9d8f',
        width: '100%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    } as ViewStyle,
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    } as TextStyle,
});

export default HomeScreen;
