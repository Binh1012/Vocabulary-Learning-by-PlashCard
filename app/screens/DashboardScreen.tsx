import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import {useRouter} from "expo-router";

const fetchDecks = async () => {
    return [
        { id: '1', title: 'TOEIC', wordCount: 200 },
        { id: '2', title: 'IELTS', wordCount: 150 },
        { id: '3', title: 'TOEFL', wordCount: 180 },
    ];
};

import { loadDecks, createDeck } from '../data';

export default function DashboardScreen() {
    const [decks, setDecks] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            const data = await loadDecks();
            setDecks(data);
        };
        loadData();
    }, []);

    const handleAddDeck = async () => {
        router.push('/screens/NewDeckScreen');
    };

    const filteredDecks = decks.filter(deck =>
        deck.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.deckCard}
            activeOpacity={0.8}
            onPress={() => router.push({
                pathname: '/screens/DeckDetailScreen',
                params: { id: item.id, title: item.title, wordCount: item.wordCount }
            })}
        >
            <Text style={styles.deckTitle}>{item.title}</Text>
            <Text style={styles.deckSubTitle}>📚 {item.wordCount} từ</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Ionicons name="menu" size={28} color="#FF7F30" />
                <Feather name="settings" size={26} color="#FF7F30" />
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#aaa" style={styles.searchIcon} />
                <TextInput
                    placeholder="Tìm bộ từ vựng..."
                    placeholderTextColor="#aaa"
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.searchInput}
                    ></TextInput>
            </View>
            <FlatList
                data={filteredDecks}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.deckList}
                ListFooterComponent={
                    <TouchableOpacity style={styles.addButton} onPress={handleAddDeck}>
                        <Text style={styles.plusText}>＋ New Deck</Text>
                    </TouchableOpacity>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDEDDC',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    searchContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingLeft: 10,
    },
    searchIcon: {
        marginLeft: 5,
    },
    deckList: {
        paddingBottom: 20,
    },
    deckCard: {
        backgroundColor: '#5BBEFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        transform: [{ scale: 1 }],
    },
    deckTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    deckSubTitle: {
        fontSize: 14,
        color: '#fff',
        marginTop: 6,
    },
    addButton: {
        backgroundColor: '#FF7F30',
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    plusText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});
