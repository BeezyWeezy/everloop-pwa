import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PwaContextType {
    currentPwaName: string | null;
    setCurrentPwaName: (name: string | null) => void;
}

const PwaContext = createContext<PwaContextType | undefined>(undefined);

export function PwaProvider({ children }: { children: ReactNode }) {
    const [currentPwaName, setCurrentPwaName] = useState<string | null>(null);

    return (
        <PwaContext.Provider value={{ currentPwaName, setCurrentPwaName }}>
            {children}
        </PwaContext.Provider>
    );
}

export function usePwa() {
    const context = useContext(PwaContext);
    if (context === undefined) {
        throw new Error('usePwa must be used within a PwaProvider');
    }
    return context;
}
