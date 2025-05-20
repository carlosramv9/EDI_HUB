import React, { useEffect, useState } from 'react'
import { useTableContext } from '@/providers/TableProvider';
import { useTranslations } from 'next-intl';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { SearchModel } from '@/interfaces/searchModel/SearchModels';

const PaginationSimple = <T extends SearchModel>({ pageSize, searchModel, setSearchModel, totalRecords }: { pageSize: number, searchModel: T, setSearchModel: (searchModel: T) => void, totalRecords: number }) => {
    // const { page, setPage, pageSize, total, totalPages } = useTableContext();
    const t = useTranslations();

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(totalRecords);
    const [totalPages] = useState(Math.ceil(totalRecords / pageSize));

    const handleChangePage = (page: number) => {
        setPage(page);
        setSearchModel({ ...searchModel, page: page, pageSize: pageSize });
    }

    return (
        <section className="flex justify-end items-center p-2 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
                <p className="text-sm">
                    {t('showing')} {(page - 1) * pageSize + 1} {t('to')} {(page * pageSize) > totalRecords ? totalRecords : (page * pageSize)} {t('of')} {totalRecords}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 1}
                        className={classNames(
                            "px-2 py-1 flex gap-2 items-center hover:cursor-pointer text-blue-500 hover:text-blue-600 text-sm",
                            "hover:underline hover:underline-offset-2",
                            page === 1 && "opacity-50 text-gray-400"
                        )}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
                        {t('previous')}
                    </button>
                    <button
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page === totalPages}
                        className={classNames(
                            "px-2 py-1 flex gap-2 items-center hover:cursor-pointer text-blue-500 hover:text-blue-600 text-sm",
                            "hover:underline hover:underline-offset-2",
                            page === totalPages && "opacity-50 text-gray-400"
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