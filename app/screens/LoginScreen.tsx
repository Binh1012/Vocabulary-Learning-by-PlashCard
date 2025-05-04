import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/images/logo1.png')} style={styles.logo} />

            {/* Tiêu đề */}
            <Text style={styles.title}>Log in</Text>

            {/* Ô nhập email/username */}
            <TextInput
                placeholder="E-mail or username"
                placeholderTextColor="#ed903b"
                style={styles.input}
            />

            {/* Ô nhập password */}
            <TextInput
                placeholder="Password"
                placeholderTextColor="#ed903b"
                secureTextEntry
                style={styles.input}
            />

            {/* Nút đăng nhập */}
            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/screens/HomeScreen')}>
                <Text style={styles.loginButtonText}>LOG IN</Text>
            </TouchableOpacity>

            {/* Đường link đăng ký */}
            <Text style={styles.signupText}>
                Don’t have an account?{' '}
                <Text style={styles.signupLink} onPress={() => router.push('/screens/SignUpScreen')}>
                    SIGN UP
                </Text>
            </Text>
        </View>
    );
}

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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#72b3f0',
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
    loginButton: {
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
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupText: {
        marginTop: 20,
        color: '#777',
    },
    signupLink: {
        color: '#4daaf2',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
