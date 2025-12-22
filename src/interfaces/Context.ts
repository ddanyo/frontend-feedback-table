export interface SearchSettings {
    searchTerm: string;
    caseSensitive: boolean;
    wholeWord: boolean;
}

export interface AppSettings {
    tanstackTable: boolean;
    tanstackVirtual: boolean;
    zustand: boolean;
    dynamicMode: boolean;
}

export interface PageSettings {
    page: number;
    pageSize: number;
}

export interface ISettingsContext {
    searchSettings: SearchSettings;
    setSearchSettings: React.Dispatch<React.SetStateAction<SearchSettings>>;

    settings: AppSettings;
    setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;

    pageSettings: PageSettings;
    setPageSettings: React.Dispatch<React.SetStateAction<PageSettings>>;
}
