import { createContext, useContext, useState, type ReactNode } from 'react';
import { createSourceRegistry, type SourceRegistry } from './registry';

const SourceRegistryContext = createContext<SourceRegistry | null>(null);

/** Injects the provider adapters, so tests (or a future backend) can swap them out. */
export function SourceRegistryProvider({
  registry,
  children,
}: {
  registry?: SourceRegistry;
  children: ReactNode;
}) {
  const [value] = useState(() => registry ?? createSourceRegistry());
  return <SourceRegistryContext.Provider value={value}>{children}</SourceRegistryContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSourceRegistry(): SourceRegistry {
  const registry = useContext(SourceRegistryContext);
  if (!registry) throw new Error('useSourceRegistry must be used inside <SourceRegistryProvider>');
  return registry;
}
