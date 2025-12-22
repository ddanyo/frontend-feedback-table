import { /*useCallback,*/ useMemo } from 'react';
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
    });

    // const wrappedSetPageSettings: typeof setPageSettings = useCallback(
    //     (updater) => {
    //         console.log('%csetPageSettings called', 'color:red;font-weight:bold', updater);

    //         setPageSettings(updater);
    //     },
    //     [setPageSettings]
    // );

    // const wrappedSetSearchSettings: typeof setSearchSettings = useCallback(
    //     (updater) => {
    //         console.log('%csetSearchSettings called', 'color:red;font-weight:bold', updater);

    //         setSearchSettings(updater);
    //     },
    //     [setSearchSettings]
    // );

    // const wrappedSetSearchSettings: typeof setSettings = useCallback(
    //     (updater) => {
    //         console.log('%csetSearchSettings called', 'color:red;font-weight:bold', updater);

    //         setSettings(updater);
    //     },
    //     [setSettings]
    // );

    const value = useMemo(
        () => ({
            searchSettings,
            setSearchSettings,
            settings,
            setSettings, //: wrappedSetSearchSettings,
            pageSettings,
            setPageSettings,
        }),
        [
            pageSettings,
            searchSettings,
            settings,
            setPageSettings,
            setSettings,
            //wrappedSetSearchSettings,
            setSearchSettings,
        ]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
