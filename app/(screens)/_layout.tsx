import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng Ionicons
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#F5A623', // Màu khi tab được chọn
                tabBarInactiveTintColor: '#777', // Màu khi tab không được chọn
                tabBarStyle: styles.tabBar, // Tùy chỉnh style cho tab bar
                tabBarLabelStyle: styles.tabBarLabel, // Style cho nhãn
                headerShown: false, // Ẩn header
            }}
        >
            <Tabs.Screen
                name="decks"
                options={{
                    title: 'Decks',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'albums' : 'albums-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="cards"
                options={{
                    title: 'Cards',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'card' : 'card-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="about"
                options={{
                    title: 'About',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'information-circle' : 'information-circle-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#fcf4e5', // Màu nền giống index.tsx
        borderTopWidth: 1,
        borderTopColor: '#e0d8c3',
        paddingBottom: 5,
        paddingTop: 5,
        height: 60, // Chiều cao tab bar
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
});
