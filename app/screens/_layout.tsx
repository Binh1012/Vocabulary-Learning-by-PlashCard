import { Stack } from 'expo-router';

export default function ScreensLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StartScreen" />
            <Stack.Screen name="HomeScreen" />
            <Stack.Screen name="LoginScreen" />
            <Stack.Screen name="SignUpScreen" />
            <Stack.Screen name="AddDeckScreen" />
            <Stack.Screen name="FlashcardScreen" />
            <Stack.Screen name="VocabularyListScreen" />
            <Stack.Screen name="AddCardScreen" />
        </Stack>
    );
}
