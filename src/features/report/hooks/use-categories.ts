import { useCallback, useEffect, useMemo, useState } from 'react';
import { toUserMessage } from '@/services/api';
import { getCategories, type Category } from '@/services/category';
import type { SelectOption } from '@/shared/components/ui';

export type UseCategories = {
  readonly options: readonly SelectOption[];
  readonly loading: boolean;
  readonly error: string | null;
  reload: () => Promise<void>;
};

export function useCategories(): UseCategories {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await getCategories());
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload().catch(() => {});
  }, [reload]);

  const options = useMemo(
    () =>
      categories.map(category => ({
        value: category.id,
        label: category.name,
      })),
    [categories],
  );

  return { options, loading, error, reload };
}
