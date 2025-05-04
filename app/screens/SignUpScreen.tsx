import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

const SignUpScreen = () => {
    const router = useRouter();
    const [age, setAge] = useState('');
    const [name, setName] = useState('');
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/images/logo1.png')} style={styles.logo} />

            {/* Tiêu đề */}
            <Text style={styles.subtitle}>Create your profile</Text>

            {/* Ô nhập tuổi */}
            <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#ed903b"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />

            {/* Ô nhập tên */}
            <TextInput
                style={styles.input}
                placeholder="Name (optional)"
                placeholderTextColor="#ed903b"
                value={name}
                onChangeText={setName}
            />

            {/* Ô nhập email/username */}
            <TextInput
                style={styles.input}
                placeholder="E-mail or username"
                placeholderTextColor="#ed903b"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
            />

            {/* Ô nhập password */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#ed903b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Nút đăng ký */}
            <TouchableOpacity style={styles.button} onPress={() => console.log('Sign Up')}>
                <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            {/* Link đăng nhập */}
            <Text style={styles.loginText}>
                Have an account?{' '}
                <Text style={styles.loginLink} onPress={() => router.push('/screens/LoginScreen')}>
                    LOG IN
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcf4e5',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    subtitle: {
        fontSize: 22,
        color: '#72b3f0',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#b8e1f5',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#ed903b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    button: {
        backgroundColor: '#ff884d',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        marginTop: 20,
        color: '#777',
    },
    loginLink: {
        color: '#4daaf2',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
