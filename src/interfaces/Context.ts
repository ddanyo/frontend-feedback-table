export interface ISettingsContext {
    searchSettings: {
        searchTerm: string;
        caseSensitive: boolean;
        wholeWord: boolean;
    };
    setSearchSettings: (prev: {
        searchTerm: string;
        caseSensitive: boolean;
        wholeWord: boolean;
    }) => void;
    settings: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
        dynamicMode: boolean;
    };
    setSettings: (prev: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
        dynamicMode: boolean;
    }) => void;
    pageSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    };
    setPageSettings: (prev: { page: number; pageSize: number; countPages: number }) => void;
}
