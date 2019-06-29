import { RegionMediaSummary } from '@whitewater-guide/commons';
import byteSize from 'byte-size';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useLabels = (summary: RegionMediaSummary) => {
  const { t } = useTranslation();
  return useMemo(() => {
    const photoSizeInt = summary.photo.size;
    const photoSizeStr = photoSizeInt ? byteSize(photoSizeInt) : '';
    const mapsSizeInt = summary.maps.size;
    const mapsSizeStr = mapsSizeInt ? byteSize(mapsSizeInt) : '';
    return {
      data: t('offline:dialog.categories.data'),
      media: t('offline:dialog.categories.media', { size: photoSizeStr }),
      maps: t('offline:dialog.categories.maps', { size: mapsSizeStr }),
    };
  }, [t, summary]);
};

export default useLabels;
