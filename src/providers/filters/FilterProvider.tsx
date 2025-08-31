import { useAppDispatch } from "@/app/store";
import { SearchModel, SMOrders, SMASNProcessed } from "@/interfaces/searchModel/SearchModels";
import { clearFilters, clearFilter as clearFilterAction, setFilters as setFiltersAction } from "@/store/features/filters/filterSlice";
import { createContext, useState, useMemo, useContext } from "react";

interface FilterProviderProps {
    children: React.ReactNode;
}

interface FilterContextProps {
    setFilters: (catalogName: string, data: SearchModel | SMOrders | SMASNProcessed) => void;
    clearAllFilters: () => void;
    clearFilter: (catalogName: string) => void;
}

const FilterContext = createContext<FilterContextProps>({
    setFilters: () => { },
    clearAllFilters: () => { },
    clearFilter: () => { },
});

const FilterProvider = ({ children }: FilterProviderProps) => {
    const dispatch = useAppDispatch();

    const clearAllFilters = () => {
        dispatch(clearFilters());
    }

    const clearFilter = (catalogName: string) => {
        dispatch(clearFilterAction({ catalogName }));
    }

    const setFilters = (catalogName: string, data: SearchModel | SMOrders | SMASNProcessed) => {
        dispatch(setFiltersAction({ catalogName, data }));
    }

    const value = useMemo(() => ({
        setFilters,
        clearAllFilters,
        clearFilter,
    }), [setFilters, clearAllFilters, clearFilter]);

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};

export default FilterProvider;