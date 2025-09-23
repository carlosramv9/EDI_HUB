import React from 'react'
import MainLayout from '@/components/layouts/MainLayout'
import ASNProcessedTable from './components/ASNProcessedTable'
import Breadcrumb from '@/components/shared/Breadcrumb'
import ASNProcessedProvider from '@/providers/asn/ASNProcessedProvider'
import TableProvider from '@/providers/TableProvider'
import ManifestProvider from '@/providers/manifest/ManifestProvider'

const ASNProcessedView = () => {
    return (
        <MainLayout>
            <TableProvider>
                <ManifestProvider>
                    <ASNProcessedProvider>
                        <div className='md:px-24 xl:px-12'>
                            <Breadcrumb />
                            <ASNProcessedTable />
                        </div>
                    </ASNProcessedProvider>
                </ManifestProvider>
            </TableProvider>
        </MainLayout>
    )
}

export default ASNProcessedView