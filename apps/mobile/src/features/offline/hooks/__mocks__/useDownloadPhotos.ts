import { sleep } from '@whitewater-guide/clients';
import { useMemo, useState } from 'react';

import type { OfflineProgress } from '../../types';
import type { PhotoChannel } from '../../utils';

interface Hook {
  loading: boolean;
  error?: Error;
  download: (
    estimatedTotal: number,
    photoChannel: PhotoChannel,
  ) => Promise<null | Error>;
}

export default (_onProgress: (p: Partial<OfflineProgress>) => void): Hook => {
  const [state, setState] = useState<any>({ loading: false });
  const download = useMemo(
    () => async (_estimTotal: number, _channel: PhotoChannel) => {
      setState({ loading: true });
      await sleep(1);
      setState({ loading: false, error: new Error('oops') });
      return new Error('oops');
    },
    [setState],
  );

  return {
    loading: state.loading,
    error: state.error,
    download,
  };
};
