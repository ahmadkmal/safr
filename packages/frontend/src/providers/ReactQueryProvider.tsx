import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { indexedDBService } from "../services/indexedDB";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});


const indexedDBStorage = {
  getItem: (key: string) => indexedDBService.getItem(key),
  setItem: (key: string, value: string) => indexedDBService.setItem(key, value),
  removeItem: (key: string) => indexedDBService.removeItem(key),
};


const persister = createAsyncStoragePersister({
  storage: indexedDBStorage,
});

interface ReactQueryProviderProps {
  children: ReactNode;
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister }}>
      {children}
    </PersistQueryClientProvider>
  );
};

export { queryClient }; 