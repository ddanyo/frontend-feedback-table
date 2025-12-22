import { useState, useEffect, useRef } from 'react';

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);

            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const lastValueStr = useRef(JSON.stringify(value));

    useEffect(() => {
        try {
            const newValueStr = JSON.stringify(value);

            if (newValueStr !== window.localStorage.getItem(key)) {
                window.localStorage.setItem(key, newValueStr);

                lastValueStr.current = newValueStr;
            }
        } catch (error) {
            console.error(error);
        }
    }, [key, value]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key !== key || !e.newValue || e.newValue === JSON.stringify(value)) return;

            try {
                const parsed = JSON.parse(e.newValue);

                setValue((prev: T) => {
                    if (JSON.stringify(prev) === e.newValue) {
                        return prev;
                    }
                    return parsed;
                });
            } catch (error) {
                console.error(error);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, value]);

    return [value, setValue];
}
