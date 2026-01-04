export interface SearchSettings {
    searchTerm: string;
    caseSensitive: boolean;
    wholeWord: boolean;
}

export interface Settings {
    tanstackTable: boolean;
    tanstackVirtual: boolean;
    zustand: boolean;
    dynamicMode: boolean;
}

export interface PageSettings {
    page: number;
    pageSize: number;
}

// export interface ISettingsContext {
//     searchSettings: SearchSettings;
//     setSearchSettings: React.Dispatch<React.SetStateAction<SearchSettings>>;

//     settings: Settings;
//     setSettings: React.Dispatch<React.SetStateAction<Settings>>;

//     pageSettings: PageSettings;
//     setPageSettings: React.Dispatch<React.SetStateAction<PageSettings>>;
// }
