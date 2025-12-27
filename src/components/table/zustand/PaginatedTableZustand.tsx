import { useMemo } from 'react';
import useZustandStore from '../../../store/useZustandStore';
import { useStore } from '../../../store/useStore';
import { PaginatedTable } from '../PaginatedTable';

export function PaginatedTableZustand() {
    console.log('PaginatedTableZustand');

    const { get: getPageSettings } = useStore.PageSettings();

    const { getPage, isLoading, error, isError } = useZustandStore.getState();
    const { items, totalPages } = useMemo(
        () => getPage(getPageSettings().page, getPageSettings().pageSize),
        [getPage, getPageSettings]
    );

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
