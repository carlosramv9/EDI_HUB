import React from 'react'
import UploadFilesProvider from '@/providers/common/UploadFilesProvider'
import UploadComponent from '@/components/shared/UploadComponent'

const ScheduleForm = () => {
    return (
        <div className="flex items-center">
            <div className="grid flex-1 gap-2">
                <UploadComponent />
            </div>
        </div>
    )
}

export default ScheduleForm