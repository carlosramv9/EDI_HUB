'use client'
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react'

export interface TableContextProps {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    total: number;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    totalPages: number;
    setTotalPages?: React.Dispatch<React.SetStateAction<number>>;
}

interface TableProps {
    data: any;
    pageSize: number;
    total: number;
    totalPages: number;
}

const TableContext = React.createContext<TableContextProps>({
    page: 1,
    setPage: () => { },
    pageSize: 10,
    setPageSize: () => { },
    total: 0,
    setTotal: () => { },
    totalPages: 0,
    setTotalPages: () => { }
});

const TableProvider = ({ children }: { children: React.ReactNode }) => {

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const values = useMemo(() => {
        return {
            page,
            setPage,
            pageSize,
            setPageSize,
            total,
            setTotal,
            totalPages,
            setTotalPages
        };
    }, [page, setPage, pageSize, setPageSize, total, setTotal, totalPages, setTotalPages]);

    return (
        <TableContext.Provider value={values}>
            {children}
        </TableContext.Provider>
    )
}

export const useTableContext = () => {
    const context = React.useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a TableProvider');
    }
    return context;
};

export const useTable = ({ data, pageSize: _pageSize, total: _total, totalPages: _totalPages }: TableProps): TableContextProps => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(_pageSize);
    const [total, setTotal] = useState<number>(_total);
    const [totalPages, setTotalPages] = useState<number>(_totalPages);

    const values: TableContextProps = useMemo(() => {
        return {
            page,
            setPage,
            pageSize,
            setPageSize,
            total,
            setTotal,
            totalPages,
            setTotalPages
        };
    }, [page, setPage, pageSize, setPageSize, total, setTotal, totalPages, setTotalPages]);

    return values;
}

export default TableProvider;

