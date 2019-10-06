import { Region } from '@whitewater-guide/commons';
import Icon from 'components/Icon';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import theme from '../../theme';

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
  canMakePayments: boolean;
  downloadRegion: () => void;
}

const DownloadButton: React.FC<Props> = React.memo((props) => {
  const { region, regionInProgress, canMakePayments, downloadRegion } = props;
  const { premium, hasPremiumAccess } = region;

  if (premium && !hasPremiumAccess && !canMakePayments) {
    return null;
  }

  if (regionInProgress === region.id) {
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
  return (
    <Icon
      icon="cloud-download"
      accessibilityLabel="download"
      style={[styles.container, styles.iconContainer]}
      iconStyle={[styles.icon, disabled && styles.iconDisabled]}
      color={theme.colors.textLight}
      onPress={disabled ? undefined : downloadRegion}
    />
  );
});

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
