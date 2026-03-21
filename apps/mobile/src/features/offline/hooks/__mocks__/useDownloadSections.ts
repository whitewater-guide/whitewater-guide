import { sleep } from '@whitewater-guide/clients';
import { useMemo, useState } from 'react';

import type { OfflineProgress } from '../../types';
import type { PhotoChannel } from '../../utils';

interface Hook {
  loading: boolean;
  error?: Error;
  download: (
    regionId: string,
    estimatedTotal: number,
    photoChannel: PhotoChannel,
  ) => Promise<null | Error>;
}

export default (
  onProgress: (p: Partial<OfflineProgress>) => void,
  _opts?: any,
): Hook => {
  const [state, setState] = useState({ loading: false });
  const download = useMemo(
    () =>
      async (
        _regionId: string,
        estimatedTotal: number,
        _photoChannel: PhotoChannel,
      ) => {
        setState({ loading: true });
        await sleep(1);
        onProgress({ data: [0, estimatedTotal] });
        await sleep(1);
        onProgress({ data: [1, estimatedTotal] });
        await sleep(1);
        onProgress({ data: [2, estimatedTotal] });
        await sleep(1);
        onProgress({ data: [3, estimatedTotal] });
        setState({ loading: false });
        return null;
      },
    [setState, onProgress],
  );

  return {
    loading: state.loading,
    error: undefined,
    download,
  };
};
