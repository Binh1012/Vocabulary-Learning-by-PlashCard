import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { addDeck } from '@/app/_services/apiService';
import Toast from 'react-native-toast-message';

const AddDeckScreen = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleCreateDeck = async () => {
        if (!title.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Deck title is required',
            });
            return;
        }

        setIsLoading(true);
        try {
            await addDeck(title);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Deck created successfully',
            });
            router.back();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to create deck. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Add New Deck</Text>
                    <TouchableOpacity
                        onPress={handleCreateDeck}
                        style={[styles.createButton, (!title.trim() || isLoading) && styles.createButtonDisabled]}
                        disabled={!title.trim() || isLoading}
                    >
                        <Text style={styles.createButtonText}>
                            {isLoading ? 'Creating...' : 'Create'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Deck Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter deck title"
                            placeholderTextColor="#ed903b"
                            value={title}
                            onChangeText={setTitle}
                            autoFocus
                            editable={!isLoading}
                        />
                    </View>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcf4e5',
    },
    content: {
        flex: 1,
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
    createButton: {
        backgroundColor: '#ff884d',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonDisabled: {
        backgroundColor: '#ffb38a',
        opacity: 0.7,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#72b3f0',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#b8e1f5',
        borderRadius: 15,
        padding: 15,
        fontSize: 16,
        color: '#ed903b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
});

export default AddDeckScreen;
