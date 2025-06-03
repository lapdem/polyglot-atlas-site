'use client';

import { useEffect, useState } from 'react';

const cache: Record<string, unknown> = {};

export function useJsonData<T = unknown>(path: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(cache[path] as T ?? null);
  const [loading, setLoading] = useState<boolean>(!cache[path]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cache[path]) return;

    const fetchData = async () => {
      try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to load ${path}`);
        const json = (await res.json()) as T;
        cache[path] = json;
        setData(json);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path]);

  return { data, loading, error };
}
