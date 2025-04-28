import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="screens/StartScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/LoginScreen" options={{ title: 'Log In' }} />
            <Stack.Screen name="screens/SignUpScreen" options={{ title: 'Sign Up' }} />
            <Stack.Screen name="screens/DashboardScreen" options={{ title: 'Dashboard' }} />
            <Stack.Screen name="screens/NewCardScreen" options={{ title: 'New Card' }} />
            <Stack.Screen name="screens/FlashcardScreen" options={{ title: 'Flashcard' }} />
            <Stack.Screen name="screens/DeckDetailScreen" options={{ title: 'Deck Details' }} />
            <Stack.Screen name="screens/NewDeckScreen" options={{ title: 'New Deck' }} />
        </Stack>
    );
}