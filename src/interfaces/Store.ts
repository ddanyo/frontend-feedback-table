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
