import { create } from 'zustand';
import { type Feedback } from '../interfaces/Feedback';
import { getFeedbacks } from '../api/feedbacks';
import { buildSearchRegex } from '../utils/searchRegex';

type State = {
    allItems: Feedback[];
    searchResults: Feedback[];
    totalPages: number;
    total: number;
    isLoading: boolean;
    isError: boolean;
    error?: string | null;

    loadAll: (limit?: number) => Promise<void>;
    clear: () => void;

    getPage: (page: number, pageSize: number) => { items: Feedback[]; totalPages: number };
    searchLocal: (query: string, caseSensitive: boolean, wholeWord: boolean) => void;
    clearSearch: () => void;
};

console.log('useAppStore');
const useZustandStore = create<State>((set, get) => ({
    allItems: [],
    searchResults: [],
    totalPages: 0,
    total: 0,
    isLoading: false,
    isError: false,
    error: null,

    loadAll: async (pageSize: number = 10) => {
        set({ isLoading: true, isError: false, error: null });
        try {
            const res = await getFeedbacks({});
            console.log('API response:', res);
            set({
                allItems: res.items || [],
                totalPages: res.totalPages || Math.ceil((res.total || 0) / pageSize),
                total: res.total || res.items.length,
                isLoading: false,
            });
        } catch (err: unknown) {
            set({
                isError: true,
                error: err instanceof Error ? err.message : 'Ошибка загрузки',
            });
        } finally {
            set({ isLoading: false });
        }
    },
    clear: () => set({ allItems: [], totalPages: 0, total: 0 }),

    getPage: (page, pageSize = 10) => {
        const items = get().allItems;
        const start = (page - 1) * pageSize;
        const slice = items.slice(start, start + pageSize);
        const totalPages = Math.ceil(items.length / pageSize);
        return { items: slice, totalPages };
    },

    searchLocal: (query, caseSensitive, wholeWord, pageSize = 10) => {
        if (!query.trim()) {
            set({ searchResults: [], totalPages: Math.ceil(get().allItems.length / 10) });
            return;
        }

        const re = buildSearchRegex(query, caseSensitive, wholeWord);
        if (!re) return;

        const filtered = get().allItems.filter((f) => {
            const text = f.feedback_text ?? '';
            return re.test(text);
        });

        set({
            searchResults: filtered,
            totalPages: Math.ceil(filtered.length / pageSize),
        });
    },

    clearSearch: () => {
        set({ searchResults: [] });
    },
}));

export default useZustandStore;
