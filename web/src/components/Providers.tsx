'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface ProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function Providers({
  children,
  queryClient: customClient,
}: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      customClient ??
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 30, // 30 minutes
            gcTime: 1000 * 60 * 60, // 1 hour
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
