"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AppStateContextType {
  error: string | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  clearError: () => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions } from "@/components/ui/item";
import { Button } from "@/components/ui/button";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setError = useCallback((err: string | null) => {
    setErrorState(err);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await fn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AppStateContext.Provider value={{ error, isLoading, setError, setIsLoading, clearError, withLoading }}>
      {children}
      {/* Global Error Toast */}
      {error && (
        <div className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm animate-slide-up">
          <Item variant="outline" className="bg-destructive border-none shadow-2xl">
            <ItemContent>
              <ItemTitle className="text-white font-bold">Achtung</ItemTitle>
              <ItemDescription className="text-white/90">
                {error}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <button 
                onClick={clearError}
                className="text-white/70 hover:text-white transition-colors p-2"
                aria-label="Schließen"
              >
                ✕
              </button>
            </ItemActions>
          </Item>
        </div>
      )}
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-sm font-medium animate-pulse text-muted-foreground">Einen Moment bitte...</p>
        </div>
      )}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
