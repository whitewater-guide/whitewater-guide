import MapboxGL from '@rnmapbox/maps';
import { useCallback, useEffect, useState } from 'react';
import useMountedState from 'react-use/lib/useMountedState';

import { useOfflineContent } from '../../OfflineContentProvider';

const getPackSize = async (regionId: string) => {
  try {
    const pack = await MapboxGL.offlineManager.getPack(regionId);
    if (!pack) {
      return null;
    }
    const status = await pack.status();
    return status
      ? status.completedResourceSize + status.completedTileSize
      : null;
  } catch (e) {
    return null;
  }
};

const useOfflineMapsPack = () => {
  const { dialogRegion } = useOfflineContent();
  const isMounted = useMountedState();
  const regionId = dialogRegion ? dialogRegion.id : '';
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    getPackSize(regionId).then((s) => {
      if (isMounted()) {
        setSize(s);
        setLoading(false);
      }
    });
  }, [isMounted, regionId]);

  const deletePack = useCallback(() => {
    MapboxGL.offlineManager
      .deletePack(regionId)
      .then(() => setSize(null))
      .catch(() => {
        // can't do anything, ignore
      });
  }, [regionId, setSize]);

  return {
    loading,
    size,
    deletePack,
  };
};

export default useOfflineMapsPack;
