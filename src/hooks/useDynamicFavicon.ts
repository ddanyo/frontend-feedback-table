import { useEffect } from 'react';

export function useDynamicFavicon(activeIconPath: string, inactiveIconPath: string) {
    useEffect(() => {
        const handleVisibilityChange = () => {
            const link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");

            if (!link) return;

            if (document.hidden) {
                link.href = inactiveIconPath;
            } else {
                link.href = activeIconPath;
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [activeIconPath, inactiveIconPath]);
}
