'use client'

import { createContext, useContext, useState } from "react";

interface ConfigurationProviderProps {
    children: React.ReactNode;
}

interface ConfigurationContextProps {
    viewTitle: string;
    setViewTitle: (title: string) => void;
}

const ConfigurationContext = createContext<ConfigurationContextProps>({
    viewTitle: '',
    setViewTitle: () => {}
});

const ConfigurationProvider = ({ children }: ConfigurationProviderProps) => {
    const [viewTitle, setViewTitle] = useState('');
    return (
        <ConfigurationContext.Provider value={{ viewTitle, setViewTitle }}>
            {children}
        </ConfigurationContext.Provider>
    );
};

export const useConfiguration = () => {
    return useContext(ConfigurationContext)
}

export default ConfigurationProvider;
