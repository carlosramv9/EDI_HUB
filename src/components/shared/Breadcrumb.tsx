'use client'

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface BreadcrumbProps {
    items?: {
        label: string;
        path: string;
    }[];
    showHome?: boolean;
}

const Breadcrumb = ({ items = [], showHome = true }: BreadcrumbProps) => {
    const pathname = usePathname();
    const t = useTranslations();
    const locales = ['es', 'en'];

    // Si no hay items, generamos el breadcrumb basado en el pathname
    const breadcrumbItems = items.length > 0 ? items : pathname
        .split('/')
        .filter(item => item !== '' && item !== '[locale]' && !locales.includes(item))
        .map((item, index, array) => ({
            label: t(`navigation.${item}.title`, { default: item.charAt(0).toUpperCase() + item.slice(1) }),
            path: '/' + array.slice(0, index + 1).join('/')
        }));

    return (
        <nav className="flex items-center space-x-2 py-4 px-4 ml-auto">
            {showHome && (
                <>
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <Home className="h-4 w-4" />
                    </Link>
                    {breadcrumbItems.length > 0 && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                </>
            )}

            {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item.path}>
                    <Link
                        href={item.path}
                        className={`text-sm font-medium ${index === breadcrumbItems.length - 1
                                ? 'text-blue-600 cursor-default pointer-events-none'
                                : 'text-gray-600 hover:text-blue-600 transition-colors'
                            }`}
                    >
                        {item.label}
                    </Link>
                    {index < breadcrumbItems.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb; 