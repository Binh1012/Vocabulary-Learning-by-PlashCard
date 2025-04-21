// app/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.replace('/screens/StartScreen');
        }, 0); // hoãn lại cho đến khi layout sẵn sàng

        return () => clearTimeout(timeout);
    }, []);

    return null;
}
