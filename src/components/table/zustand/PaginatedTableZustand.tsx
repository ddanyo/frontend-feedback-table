import { useEffect } from 'react';
import useZustandStore from '../../../store/useZustandStore';
import { useStore } from '../../../store/useStore';
import { PaginatedTable } from '../PaginatedTable';
import { pollingInterval } from '../../../constans/ZustandConfig';

export function PaginatedTableZustand() {
    console.log('PaginatedTableZustand');

    const { get: getPageSettings } = useStore.PageSettings();
    const { page, pageSize } = getPageSettings();

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

    const { items, totalPages } = getPage(page, pageSize);

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
