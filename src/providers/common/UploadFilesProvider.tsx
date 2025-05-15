"use client"
import React, { useMemo } from "react";

interface UploadFilesProviderProps {
    children: React.ReactNode;
}

interface UploadFilesContext {
    files: File[];
    setFiles: (files: File[]) => void;
}

const UploadFilesContext = React.createContext<UploadFilesContext | null>(null);

const UploadFilesProvider = ({ children }: UploadFilesProviderProps) => {
    const [files, setFiles] = React.useState<File[]>([]);

    const value = useMemo(() => ({ files, setFiles }), [files]);

    return <UploadFilesContext.Provider value={value}>{children}</UploadFilesContext.Provider>;
};

export const useUploadFiles = () => {
    const context = React.useContext(UploadFilesContext);
    if (!context) {
        throw new Error("useUploadFiles must be used within an UploadFilesProvider");
    }
    return context;
};

export default UploadFilesProvider;