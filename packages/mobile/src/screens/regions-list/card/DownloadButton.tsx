import type { Region } from '@whitewater-guide/schema';
import React, { memo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Icon from '~/components/Icon';
import { useOfflineDate } from '~/features/offline';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    right: 0,
    width: 48,
    height: 40,
  },
  iconContainer: {
    paddingTop: theme.margin.half,
  },
  loadingContainer: {
    paddingTop: theme.margin.single,
  },
  icon: {
    ...theme.shadow,
  },
  iconDisabled: {
    opacity: 0.65,
  },
});

interface Props {
  region: Pick<Region, 'id' | 'premium' | 'hasPremiumAccess'>;
  regionInProgress: string | null;
  offlineError?: Error;
  canMakePayments: boolean;
  downloadRegion: () => void;
}

const DownloadButton = memo<Props>((props) => {
  const {
    region,
    regionInProgress,
    canMakePayments,
    downloadRegion,
    offlineError,
  } = props;
  const { premium, hasPremiumAccess } = region;
  // This is a workaround. For some reason, apollo query won't return local field from regionsListQuery
  const offlineDate = useOfflineDate(region.id);

  if (premium && !hasPremiumAccess && !canMakePayments) {
    return null;
  }

  if (regionInProgress === region.id && !offlineError) {
    return (
      <TouchableWithoutFeedback
        onPress={downloadRegion}
        accessibilityRole="button"
      >
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator
            color={theme.colors.textLight}
            size="small"
            accessibilityLabel="loading"
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const disabled = !!regionInProgress && regionInProgress !== region.id;
  const hasFailed = !!offlineError && regionInProgress === region.id;
  return (
    <Icon
      icon={hasFailed ? 'cloud-alert' : 'cloud-download'}
      accessibilityLabel="download"
      accessibilityHint={hasFailed ? 'download failed' : 'download'}
      testID="download-button"
      style={[styles.container, styles.iconContainer]}
      iconStyle={[styles.icon, disabled && styles.iconDisabled]}
      color={
        hasFailed
          ? theme.colors.error
          : offlineDate
          ? theme.colors.accent
          : theme.colors.textLight
      }
      onPress={disabled ? undefined : downloadRegion}
    />
  );
});

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
