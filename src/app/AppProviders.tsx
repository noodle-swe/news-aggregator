import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { SourceRegistryProvider } from '@/services/sources/SourceRegistryContext';
import type { SourceRegistry } from '@/services/sources/registry';
import { createQueryClient } from './queryClient';

export function AppProviders({
  children,
  registry,
  queryClient,
}: {
  children: ReactNode;
  registry?: SourceRegistry;
  queryClient?: QueryClient;
}) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  return (
    <QueryClientProvider client={client}>
      <SourceRegistryProvider registry={registry}>{children}</SourceRegistryProvider>
    </QueryClientProvider>
  );
}
