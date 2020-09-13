import { useCallback } from 'react';

export default () => {
  return useCallback(() => {
    return {
      photos: 6,
      sections: 3,
    };
  }, []);
};
