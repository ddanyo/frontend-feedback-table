import { useState, useEffect, useRef } from 'react';

export function useLocalStorage(key: string, initialValue: object) {
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
            if (e.key === key && e.newValue) {
                setValue(JSON.parse(e.newValue));
                lastValueStr.current = e.newValue;
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [value, setValue];
}
