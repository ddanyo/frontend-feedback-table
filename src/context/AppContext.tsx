import { createContext, useContext } from 'react';
import { type ISettingsContext } from '../interfaces/Context';

console.log('AppContext');
export const AppContext = createContext<ISettingsContext | null>(null);

export const useSettings = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useSettings must be used within an AppProvider');
    }
    return context;
};
