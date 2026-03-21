import { useCallback } from 'react';

export default () =>
  useCallback(
    () => ({
      photos: 6,
      sections: 3,
    }),
    [],
  );
