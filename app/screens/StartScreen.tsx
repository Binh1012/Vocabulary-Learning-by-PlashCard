// app/screens/StartScreen.tsx
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function StartScreen() {
    const router = useRouter();

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push('/screens/LoginScreen')}>
            <Image source={require('../../assets/images/logo1.png')} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF2E3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 180,
        height: 180,
    },
});
