'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import Header from './Header';
import { Metadata } from 'next';
import Footer from '../shared/Footer';

export const metadata: Metadata = {
    title: 'EDI HUB MANAGEMENT',
    description: 'EDI HUB Management',
    icons: {
        icon: '/favicon.ico',
    },
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const { collapsed } = useSidebar();

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
                <Header />
                <main className="flex-1 p-4 bg-white">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;