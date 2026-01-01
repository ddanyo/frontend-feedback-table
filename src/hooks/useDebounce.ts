import { useEffect } from 'react';

export function useDebounce(func: () => void, delay: number = 500) {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            func();
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [func, delay]);
}
