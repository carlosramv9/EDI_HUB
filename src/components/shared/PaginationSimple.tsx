import React from 'react'
import { useTableContext } from '@/providers/TableProvider';
import { useTranslations } from 'next-intl';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

const PaginationSimple = () => {
    const { page, setPage, pageSize, setPageSize, total, setTotal, totalPages, setTotalPages } = useTableContext();
    const t = useTranslations();
    return (
        <section className="flex justify-end items-center p-2 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
                <p className="text-sm">{t('showing')} {page * pageSize > total ? total : page * pageSize} {t('of')} {total}</p>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPage(page - 1)} disabled={page === 1}
                        className={classNames(
                            "px-2 py-1 flex gap-2 items-center hover:cursor-pointer text-blue-500 hover:text-blue-600 text-sm",
                            `hover:underline hover:underline-offset-2`,
                            // page === 1 && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                        {t('previous')}
                    </button>
                    <button onClick={() => setPage(page + 1)} disabled={page === totalPages}
                        className={classNames(
                            "px-2 py-1 flex gap-2 items-center hover:cursor-pointer text-blue-500 hover:text-blue-600 text-sm",
                            `hover:underline hover:underline-offset-2`,
                            // page === totalPages && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {t('next')}
                        <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}

export default PaginationSimple