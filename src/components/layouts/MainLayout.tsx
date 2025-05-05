'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import Header from './Header';
import { Metadata } from 'next';
import Footer from '../shared/Footer';
import classNames from 'classnames';
import { useAuth } from '@/providers/Authenticate/AuthProvider';
import LoaderSplash from '../ui/LoaderSplash';

export const metadata: Metadata = {
    title: 'EDI HUB MANAGEMENT',
    description: 'EDI HUB Management',
    icons: {
        icon: '/favicon.ico',
    },
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { collapsed } = useSidebar();
    const { loadingAuth } = useAuth();

    // if (loadingAuth) {
    //     return <LoaderSplash />;
    // }

    return (
        <div className="flex h-screen">
            {loadingAuth && <LoaderSplash />}
            <Sidebar />
            <div className={classNames(
                "flex flex-col flex-1 transition-all duration-300 shadow-md overflow-x-hidden",
                { 'ml-16': collapsed },
                { 'ml-64': !collapsed }
            )}>
                <Header />
                <main className="flex-1 bg-background dark:bg-backgrounddark">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;