import React from 'react';
import { ActivityIndicator } from 'react-native';
import theme from '../../../../theme';
import DeleteMapsButton from './DeleteMapsButton';
import OfflineCategory, { OfflineCategoryProps } from './OfflineCategory';
import useOfflineMapsPack from './useOfflineMapsPack';

const OfflineCategoryMaps: React.FC<OfflineCategoryProps> = (props) => {
  const { type, label, selected, onToggle } = props;
  const { size, loading, deletePack } = useOfflineMapsPack();
  return (
    <OfflineCategory
      disabled={loading || !!size}
      type={type}
      label={label}
      selected={selected || !!size}
      onToggle={onToggle}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.colors.primary} />
      ) : size ? (
        <DeleteMapsButton onDelete={deletePack} size={size} />
      ) : null}
    </OfflineCategory>
  );
};

OfflineCategoryMaps.displayName = 'OfflineCategoryMaps';

export default OfflineCategoryMaps;
