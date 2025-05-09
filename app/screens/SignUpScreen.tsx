import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Animated, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { signUp, AuthError } from '@/app/_services/authService';
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill in all fields',
            });
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Passwords do not match',
            });
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Password must be at least 6 characters long',
            });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await signUp(email, password);
            router.push('/screens/HomeScreen');
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Account created successfully',
            });
        } catch (error) {
            const authError = error as AuthError;
            let errorMessage = 'An error occurred. Please try again';
            switch (authError.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'An account already exists with this email';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/operation-not-allowed':
                    errorMessage = 'Email/password accounts are not enabled';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak';
                    break;
            }
            setError(errorMessage);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
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
                <Image source={require('../../assets/screen/logo1.png')} style={styles.logo} />

                <Text style={styles.title}>Sign Up</Text>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="E-mail"
                        placeholderTextColor="#ed903b"
                        style={styles.input}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setError(null);
                        }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!isLoading}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#ed903b"
                        secureTextEntry
                        style={styles.input}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setError(null);
                        }}
                        editable={!isLoading}
                    />

                    <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor="#ed903b"
                        secureTextEntry
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setError(null);
                        }}
                        editable={!isLoading}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.signupButton,
                        (!email || !password || !confirmPassword || isLoading) && styles.signupButtonDisabled
                    ]}
                    onPress={handleSignUp}
                    disabled={!email || !password || !confirmPassword || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.signupButtonText}>SIGN UP</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text
                        style={styles.loginLink}
                        onPress={() => router.push('/screens/LoginScreen')}
                    >
                        LOG IN
                    </Text>
                </Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#72b3f0',
        marginBottom: 30,
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        width: '100%',
    },
    errorText: {
        color: '#d32f2f',
        textAlign: 'center',
        fontSize: 14,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        backgroundColor: '#b8e1f5',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        color: '#ed903b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    signupButton: {
        backgroundColor: '#ff884d',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 15,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        minWidth: 150,
        alignItems: 'center',
    },
    signupButtonDisabled: {
        backgroundColor: '#ffb38a',
        opacity: 0.7,
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginText: {
        marginTop: 25,
        color: '#777',
        fontSize: 16,
    },
    loginLink: {
        color: '#4daaf2',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
