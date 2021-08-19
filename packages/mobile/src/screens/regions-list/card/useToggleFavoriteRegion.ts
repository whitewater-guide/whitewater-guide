import { useCallback } from 'react';


export default function useToggleFavoriteRegion(id: string) {
  return useCallback(() => {
    mutate({ variables: { id, favorite } }).catch(() => {});
  }, [mutate]);
}
