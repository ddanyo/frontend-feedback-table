import React from 'react';
import { AppContext } from './AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useLocalStorage('app-settings', {
        tanstackTable: false,
        tanstackVirtual: false,
        zustand: false,
        dynamicMode: false,
    });

    const [searchSettings, setSearchSettings] = useLocalStorage('app-search-settings', {
        searchTerm: '',
        caseSensitive: false,
        wholeWord: false,
    });

    const [pageSettings, setPageSettings] = useLocalStorage('app-page-settings', {
        page: 1,
        pageSize: 10,
        countPages: 1,
    });

    const wrappedSetPageSettings: typeof setPageSettings = (updater) => {
        console.log('%csetPageSettings called', 'color:red;font-weight:bold', updater);

        setPageSettings(updater);
    };

    const value = {
        searchSettings,
        setSearchSettings,
        settings,
        setSettings,
        pageSettings,
        setPageSettings: wrappedSetPageSettings,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
