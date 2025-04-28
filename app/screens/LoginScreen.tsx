import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '@env';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                router.push('/screens/DashboardScreen');
            } else {
                Alert.alert('Error', 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Failed to log in');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>FLASHCARD{'\n'}<Text style={{ color: '#FF9040' }}>VOCABULARY</Text></Text>
            <Text style={styles.header}>Log in</Text>
            <TextInput
                placeholder="E-mail or username"
                style={styles.input}
                placeholderTextColor="#FF9040"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#FF9040"
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOG IN</Text>
            </TouchableOpacity>
            <Text style={styles.footer}>
                Don’t have an account?{' '}
                <Text onPress={() => router.push('/screens/SignUpScreen')} style={styles.link}>SIGN UP</Text>
            </Text>
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
    footer: {
        marginTop: 20,
        color: '#333',
    },
    link: {
        color: '#FF9040',
        fontWeight: '600',
    },
});