import { useEffect } from 'react';
import { useStore, useZustandStore } from '@store';
import { PaginatedTable } from '@components';
import { pollingInterval } from '@constants';
import { useAddressBar } from '@hooks';

export function PaginatedTableZustand() {
    console.log('PaginatedTableZustand');

    const { get } = useStore.Settings();
    const { urlParams } = useAddressBar(get().zustand);

    useZustandStore((state) => state.allItems);
    useZustandStore((state) => state.searchResults);
    useZustandStore((state) => state.isSearching);

    const isLoading = useZustandStore((state) => state.isLoading);
    const isError = useZustandStore((state) => state.isError);
    const error = useZustandStore((state) => state.error);

    const getPage = useZustandStore((state) => state.getPage);
    const startPolling = useZustandStore((state) => state.startPolling);
    const stopPolling = useZustandStore((state) => state.stopPolling);

    useEffect(() => {
        startPolling(pollingInterval);
        return () => stopPolling();
    }, [startPolling, stopPolling]);

    const { items, totalPages } = getPage(urlParams.page, urlParams.pageSize);

    return (
        <PaginatedTable
            items={items}
            error={error ? error : ''}
            isError={isError}
            isLoading={isLoading}
            totalPages={totalPages}
        />
    );
}
