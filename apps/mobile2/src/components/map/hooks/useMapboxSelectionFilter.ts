import { useMapSelection } from '@whitewater-guide/clients';
import { useMemo } from 'react';

export const useMapboxSelectionFilter = () => {
  const [selection] = useMapSelection();
  return useMemo(
    () => ['all', ['==', '$id', selection ? selection.id : 'x']] as any,
    [selection],
  );
};
