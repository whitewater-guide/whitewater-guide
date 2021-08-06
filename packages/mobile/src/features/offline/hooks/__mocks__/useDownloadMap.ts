import { sleep } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/schema';
import { useMemo, useState } from 'react';

import { OfflineProgress } from '../../types';

interface Hook {
  loading: boolean;
  error?: Error;
  download: (
    regionId: string,
    bounds: Region['bounds'],
  ) => Promise<null | Error>;
}

export default (onProgress: (p: Partial<OfflineProgress>) => void): Hook => {
  const [state, setState] = useState({ loading: false });
  const download = useMemo(
    () => async () => {
      setState({ loading: true });
      await sleep(1);
      onProgress({ maps: [0, 100] });
      await sleep(1);
      onProgress({ maps: [50, 100] });
      await sleep(1);
      onProgress({ maps: [100, 100] });
      await sleep(1);
      setState({ loading: false });
      return null;
    },
    [setState, onProgress],
  );

  return {
    error: undefined,
    loading: state.loading,
    download,
  };
};
