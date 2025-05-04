import { useRouter } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const StartScreen = () => {
    const router = useRouter();

    const handlePress = () => {
        router.push('/screens/LoginScreen');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <Image source={require('../../assets/images/logo1.png')} style={styles.logo} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fcf4e5', // nền sáng theo đúng mẫu của bạn
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 160,
        height: 160,
        resizeMode: 'contain',
    },
});

export default StartScreen;
