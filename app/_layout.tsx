import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { AuthProvider } from './_contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function Layout() {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
            <Toast />
        </AuthProvider>
    );
}
