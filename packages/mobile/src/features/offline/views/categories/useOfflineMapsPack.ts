import MapboxGL from '@react-native-mapbox-gl/maps';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../core/redux/reducers';

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
  const region = useSelector(
    (state: RootState) => state.offlineContent.dialogRegion,
  );
  const regionId = region ? region.id : '';
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState<number | null>(null);
  useEffect(() => {
    getPackSize(regionId).then((s) => {
      setSize(s);
      setLoading(false);
    });
  }, []);
  const deletePack = useCallback(() => {
    MapboxGL.offlineManager
      .deletePack(regionId)
      .then(() => setSize(null))
      .catch(() => {});
  }, [regionId, setSize]);
  return {
    loading,
    size,
    deletePack,
  };
};

export default useOfflineMapsPack;
