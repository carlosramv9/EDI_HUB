import React from 'react';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';

interface FrontendPaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    itemsPerPageOptions?: number[];
}

const FrontendPagination: React.FC<FrontendPaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    itemsPerPageOptions = [10, 20, 50, 100]
}) => {
    const t = useTranslations();
    
    // Validaciones para evitar errores
    if (!totalItems || totalItems <= 0 || !itemsPerPage || itemsPerPage <= 0) {
        return null;
    }
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Calcular qué números de página mostrar
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Si hay pocas páginas, mostrar todas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Siempre mostrar la primera página
            pages.push(1);

            if (currentPage <= 4) {
                // Cerca del inicio
                for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Cerca del final
                pages.push('ellipsis');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // En el medio
                pages.push('ellipsis');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && onPageChange) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {/* Información de resultados */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                    {t('showing') || 'Mostrando'} <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> {t('to') || 'a'} <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> {t('of') || 'de'} <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> {t('results') || 'resultados'}
                </span>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
                {/* Selector de items por página */}
                {onItemsPerPageChange && (
                    <div className="flex items-center gap-2 mr-4">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                            {t('itemsPerPage') || 'Por página'}:
                        </label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Botones de navegación */}
                <div className="flex items-center gap-1">
                    {/* Primera página */}
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={classNames(
                            "p-2 rounded-md transition-all duration-200",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            currentPage === 1
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        )}
                        aria-label="Primera página"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Página anterior */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={classNames(
                            "p-2 rounded-md transition-all duration-200",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            currentPage === 1
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        )}
                        aria-label="Página anterior"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Números de página */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => {
                            if (page === 'ellipsis') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-2 py-1 text-gray-400 dark:text-gray-500"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            const pageNum = page as number;
                            const isActive = pageNum === currentPage;

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={classNames(
                                        "min-w-[36px] px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                                        isActive
                                            ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                                            : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
                                    )}
                                    aria-label={`Página ${pageNum}`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    {/* Página siguiente */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={classNames(
                            "p-2 rounded-md transition-all duration-200",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            currentPage === totalPages
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        )}
                        aria-label="Página siguiente"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Última página */}
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={classNames(
                            "p-2 rounded-md transition-all duration-200",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            currentPage === totalPages
                                ? "text-gray-300 dark:text-gray-600"
                                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        )}
                        aria-label="Última página"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FrontendPagination;

