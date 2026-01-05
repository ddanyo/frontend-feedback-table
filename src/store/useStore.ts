import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '@interfaces';

const defaults: {
    settings: Settings;
} = {
    settings: {
        tanstackTable: false,
        tanstackVirtual: false,
        zustand: false,
        dynamicMode: false,
    },
};

const keys = {
    settings: 'app-settings',
};

function useStoreHook<K extends keyof typeof keys>(
    group: K
): {
    get: () => (typeof defaults)[K];
    set: (value: (typeof defaults)[K]) => void;
    update: (updater: (prev: (typeof defaults)[K]) => (typeof defaults)[K]) => void;
} {
    const key = keys[group];
    const initialValue = defaults[group];

    const [value, setValue] = useState<(typeof defaults)[K]>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading ${group} from localStorage:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            const newValueStr = JSON.stringify(value);
            if (newValueStr !== window.localStorage.getItem(key)) {
                window.localStorage.setItem(key, newValueStr);

                window.dispatchEvent(
                    new CustomEvent(`localstorage-update-${key}`, { detail: value })
                );
            }
        } catch (error) {
            console.error(`Error writing ${group} to localStorage:`, error);
        }
    }, [key, value, group]);

    useEffect(() => {
        const handleStoreChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue && e.newValue !== JSON.stringify(value)) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    setValue(parsed);
                } catch (error) {
                    console.error(`Error parsing ${group} from storage event:`, error);
                }
            }
        };

        window.addEventListener('storage', handleStoreChange);
        return () => window.removeEventListener('storage', handleStoreChange);
    }, [key, value, group]);

    useEffect(() => {
        const handleCustomUpdate = (e: CustomEvent<(typeof defaults)[K]>) => {
            if (JSON.stringify(e.detail) !== JSON.stringify(value)) {
                setValue(e.detail);
            }
        };

        window.addEventListener(`localstorage-update-${key}`, handleCustomUpdate as EventListener);
        return () =>
            window.removeEventListener(
                `localstorage-update-${key}`,
                handleCustomUpdate as EventListener
            );
    }, [key, value]);

    const get = useCallback(() => value, [value]);

    const set = useCallback((newValue: (typeof defaults)[K]) => {
        setValue(newValue);
    }, []);

    const update = useCallback((updater: (prev: (typeof defaults)[K]) => (typeof defaults)[K]) => {
        setValue(updater);
    }, []);

    return { get, set, update };
}

export const useStore = {
    Settings: () => useStoreHook('settings'),
};
