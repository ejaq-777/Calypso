import { useState, useEffect, useCallback } from 'react';

export function useImageCount(warningsOnly: boolean) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Reusable fetch function that handles loading and errors
  const refreshCount = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/images/count?warningsOnly=${warningsOnly}`);
      const data = await response.json();
      setCount(data.count);
    } catch (err) {
      console.error('Failed to fetch image count:', err);
    } finally {
      setLoading(false);
    }
  }, [warningsOnly]);

  // Automatically fetch on mount or when warningsOnly changes
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return { count, loading, refreshCount };
}