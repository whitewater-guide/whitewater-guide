import { sleep } from '@whitewater-guide/clients';
import { useMemo, useState } from 'react';

import { OfflineProgress } from '../../types';
import { PhotoChannel } from '../../utils';

interface Hook {
  loading: boolean;
  error?: Error;
  download: (
    estimatedTotal: number,
    photoChannel: PhotoChannel,
  ) => Promise<null | Error>;
}

export default (onProgress: (p: Partial<OfflineProgress>) => void): Hook => {
  const [state, setState] = useState<any>({ loading: false });
  const download = useMemo(
    () => async (estimTotal: number, channel: PhotoChannel) => {
      setState({ loading: true });
      await sleep(1);
      setState({ loading: false, error: new Error('oops') });
      return new Error('oops');
    },
    [setState, onProgress],
  );

  return {
    loading: state.loading,
    error: state.error,
    download,
  };
};
