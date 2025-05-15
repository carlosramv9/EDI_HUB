"use client"

import { useState } from "react"
import FileUpload from "@/components/ui/file-upload"
import { useUploadFiles } from "@/providers/common/UploadFilesProvider"

export default function UploadComponent() {
    // const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const { files: uploadedFiles, setFiles: setUploadedFiles } = useUploadFiles()

    const handleFilesSelected = (files: File[]) => {
        setUploadedFiles(files)
        console.log("Files selected:", files)

        // Here you would typically upload the files to your server
        // For example:
        // const formData = new FormData();
        // files.forEach(file => {
        //   formData.append('files', file);
        // });
        // fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData
        // });
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg">
                <FileUpload
                    onFilesSelected={handleFilesSelected}
                    maxFiles={5}
                    maxSizeMB={5}
                />
            </div>
        </div>
    )
}