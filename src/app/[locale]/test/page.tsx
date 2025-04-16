import MainLayout from '@/components/layouts/MainLayout'
import React from 'react'
import Loader from '../../../components/ui/Loader';
import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "Test "
};
const page = () => {
    const t = useTranslations('titles')
    return (
        <MainLayout>
            <Loader />
        </MainLayout>
    )
}

export default page