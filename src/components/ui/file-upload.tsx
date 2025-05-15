"use client"

import { useState, useRef, type ChangeEvent, type DragEvent } from "react"
import { X, Upload, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUploadFiles } from "@/providers/common/UploadFilesProvider"

interface FileUploadProps {
    onFilesSelected: (files: File[]) => void
    maxFiles?: number
    maxSizeMB?: number
    acceptedFileTypes?: string[]
    className?: string
}

export default function FileUpload({
    onFilesSelected,
    maxFiles = 1,
    maxSizeMB = 10,
    // acceptedFileTypes = ["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx"],
    acceptedFileTypes = [".xls", ".xlsx"],
    className,
}: FileUploadProps) {
    const [files, setFiles] = useState<File[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // const { files, setFiles } = useUploadFiles()

    const maxSizeBytes = maxSizeMB * 1024 * 1024

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(Array.from(e.target.files))
        }
    }

    const addFiles = (newFiles: File[]) => {
        setError(null)

        // Check if adding these files would exceed the max file count
        if (files.length + newFiles.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} files`)
            return
        }

        // Validate file types and sizes
        const validFiles = newFiles.filter((file) => {
            // Check file size
            if (file.size > maxSizeBytes) {
                setError(`File "${file.name}" exceeds the maximum size of ${maxSizeMB}MB`)
                return false
            }

            // Check file type
            const fileType = file.type
            const fileExtension = `.${file.name.split(".").pop()}`

            const isValidType = acceptedFileTypes.some((type) => {
                if (type.startsWith(".")) {
                    return fileExtension.toLowerCase() === type.toLowerCase()
                }
                if (type.includes("*")) {
                    const typePrefix = type.split("*")[0].slice(0, -1)
                    return fileType.startsWith(typePrefix)
                }
                return fileType === type
            })

            if (!isValidType) {
                setError(`File "${file.name}" has an unsupported file type`)
                return false
            }

            return true
        })

        if (validFiles.length > 0) {
            const updatedFiles = [...files, ...validFiles]
            setFiles(updatedFiles)
            onFilesSelected(updatedFiles)
        }
    }

    const removeFile = (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index)
        setFiles(updatedFiles)
        onFilesSelected(updatedFiles)
    }

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isDragging) {
            setIsDragging(true)
        }
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFiles(Array.from(e.dataTransfer.files))
        }
    }

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const isImage = (file: File) => {
        return file.type.startsWith("image/")
    }

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 transition-colors",
                    "flex flex-col items-center justify-center cursor-pointer",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-primary/50 dark:border-gray-700 dark:hover:border-gray-600",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20",
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={openFileDialog}
                tabIndex={0}
                role="button"
                aria-label="Upload files"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept={acceptedFileTypes.join(",")}
                    className="sr-only"
                />

                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">Drag & drop files here</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        or <span className="text-primary font-medium">browse</span> to upload
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Max {maxFiles} files, up to {maxSizeMB}MB each
                    </p>
                </div>
            </div>

            {error && <div className="mt-2 text-sm text-red-500">{error}</div>}

            {files.length > 0 && (
                <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium">
                        Selected files ({files.length}/{maxFiles})
                    </h4>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                            >
                                <div className="flex items-center space-x-3">
                                    {isImage(file) ? (
                                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <img
                                                src={URL.createObjectURL(file) || "/placeholder.svg"}
                                                alt={file.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <FileIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(index)
                                    }}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
