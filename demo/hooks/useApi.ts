// frontend/src/hooks/useApi.ts

import { useState, useEffect } from 'react';
import ApiService from '@/services/apiService';

export interface UseApiOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export function useApi(options?: UseApiOptions) {
  const [apiService] = useState(() => {
    const config = {
      baseUrl: options?.baseUrl || process.env.NEXT_PUBLIC_API_URL || '/api',
      headers: {
        ...options?.headers,
      },
    };
    return new ApiService(config);
  });

  return apiService;
}