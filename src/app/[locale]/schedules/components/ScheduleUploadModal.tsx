'use client'
import React, { Fragment, useEffect } from 'react'
import { useScheduleContext } from '@/providers/schedules/ScheduleProvider'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/Button'
import UploadFilesProvider, { useUploadFiles } from '@/providers/common/UploadFilesProvider'
import ScheduleForm from './ScheduleForm'
import { cn } from '@/lib/utils'
import { useOrders } from '@/providers/orders/OrdersProvider'
import { useAppSelector } from '@/app/store'
import { SMOrders } from '@/interfaces/searchModel/SearchModels'

const ScheduleUploadModal = ({
    buttonClassName
}: { buttonClassName?: string }) => {
    const searchModel = useAppSelector((state) => state.filters.schedules) as SMOrders;
    const { showModal, setShowModal } = useScheduleContext();
    const { files, setFiles } = useUploadFiles()
    const { uploadFiles } = useOrders()

    useEffect(() => {
        return () => {
            setFiles([])
        }
    }, [showModal])

    const processUpload = async () => {
        await uploadFiles(files, searchModel)
        setShowModal(false)
    }

    return (
        <>
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogTrigger asChild>
                    <Button variant="outline" className={cn(buttonClassName)}>Add Schedules</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Schedules</DialogTitle>
                        <DialogDescription>
                            Upload schedules to the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <ScheduleForm />
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        {files.length > 0 && (
                            <button
                                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                onClick={processUpload}
                            >
                                Upload {files.length} {files.length === 1 ? "file" : "files"}
                            </button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ScheduleUploadModal