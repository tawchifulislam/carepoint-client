'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from './api';
import type { Paginated } from '@/types/pagination';

export function usePagedList<T extends { id: string }>(basePath: string) {
  const [items, setItems] = useState<T[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const requestId = useRef(0);

  const fetchPage = useCallback(
    async (pageNumber: number): Promise<Paginated<T>> => {
      const separator = basePath.includes('?') ? '&' : '?';
      const response = await apiFetch(
        `${basePath}${separator}page=${pageNumber}`,
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    },
    [basePath],
  );

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    setError(false);

    try {
      const result = await fetchPage(1);

      if (id !== requestId.current) return;

      setItems(result.data);
      setPage(1);
      setTotalPages(result.totalPages);
    } catch {
      if (id === requestId.current) setError(true);
    }
  }, [fetchPage]);

  useEffect(() => {
    setItems(null);
    reload();
  }, [reload]);

  const loadMore = useCallback(async () => {
    const id = requestId.current;
    setLoadingMore(true);
    setError(false);

    try {
      const result = await fetchPage(page + 1);

      if (id !== requestId.current) return;

      setItems(current => {
        const existing = current ?? [];
        const known = new Set(existing.map(item => item.id));
        return [
          ...existing,
          ...result.data.filter(item => !known.has(item.id)),
        ];
      });
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch {
      if (id === requestId.current) setError(true);
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, page]);

  return {
    items,
    error,
    loadingMore,
    hasMore: page < totalPages,
    reload,
    loadMore,
  };
}
