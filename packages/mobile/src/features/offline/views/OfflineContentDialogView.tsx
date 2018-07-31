import React from 'react';
import { translate } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Caption, DialogActions, DialogTitle } from 'react-native-paper';
import { OfflineQueryPlaceholder } from '../../../components';
import { WithT } from '../../../i18n';
import theme from '../../../theme';
import { OfflineCategorySelection, OfflineCategoryType } from '../types';
import OfflineCategory from './OfflineCategory';
import { InnerProps } from './types';

const styles = StyleSheet.create({
  categoriesContainer: {
    marginBottom: theme.margin.double,
    marginHorizontal: theme.margin.double,
  },
  cacheWarningContainer: {
    height: theme.rowHeight,
    paddingHorizontal: theme.margin.single,
  },
  loadingSummaryContainer: {
    height: 4 * theme.rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.margin.double,
  },
});

type Props = InnerProps & WithT;

interface State {
  selection: OfflineCategorySelection;
}

class OfflineContentDialogView extends React.PureComponent<Props, State> {
  readonly state: State = {
    selection: {
      data: true,
      media: false,
      maps: false,
    },
  };

  onDownload = () => {
    if (this.props.onDownload) {
      this.props.onDownload(this.state.selection);
    }
  };

  onToggleCategory = (type: OfflineCategoryType, value: boolean) => {
    // @ts-ignore
    this.setState({
      selection: {
        ...this.state.selection,
        [type]: value,
      },
    });
  };

  renderCategories = () => {
    const { t, inProgress, progress, summary } = this.props;
    const { selection } = this.state;
    const photoSize = summary ? summary.photo.size : undefined;
    return (
      <View style={styles.categoriesContainer}>
        <OfflineCategory
          disabled
          selected={selection.data}
          type="data"
          inProgress={inProgress}
          progress={progress.data}
          onToggle={this.onToggleCategory}
          label={t('offline:dialog.categories.data')}
        />
        <OfflineCategory
          type="media"
          selected={selection.media}
          inProgress={inProgress}
          progress={progress.media}
          onToggle={this.onToggleCategory}
          label={t('offline:dialog.categories.media')}
          size={photoSize}
        />
        <OfflineCategory
          disabled
          unavailable
          type="maps"
          selected={selection.maps}
          inProgress={inProgress}
          progress={progress.media}
          onToggle={this.onToggleCategory}
          label={t('offline:dialog.categories.maps')}
        />
        <View style={styles.cacheWarningContainer}>
          <Caption>
            {t('offline:dialog:cacheWarning')}
          </Caption>
        </View>
      </View>
    );
  };

  renderLoadingSummary = () => {
    const { t } = this.props;
    return (
      <View style={styles.loadingSummaryContainer}>
        <ActivityIndicator color={theme.colors.primary} />
        <Caption>{t('offline:dialog.loadingSummary')}</Caption>
      </View>
    );
  };

  renderOffline = () => (
    <View style={styles.loadingSummaryContainer}>
      <OfflineQueryPlaceholder />
    </View>
  );

  render() {
    const { region, onDismiss, isConnected = true, isLoadingSummary, t } = this.props;
    if (!region) {
      return null;
    }
    return (
      <React.Fragment>
        <DialogTitle>{t('offline:dialog.title', { region: region.name })}</DialogTitle>
        {!isConnected && this.renderOffline()}
        {!!isLoadingSummary && this.renderLoadingSummary()}
        {!!isConnected && !isLoadingSummary && this.renderCategories()}
        <DialogActions>
          <Button raised onPress={onDismiss}>
            {t('commons:cancel')}
          </Button>
          <Button primary raised disabled={!isConnected} onPress={this.onDownload}>
            {t('commons:ok')}
          </Button>
        </DialogActions>
      </React.Fragment>
    );
  }
}

export default translate()(OfflineContentDialogView);
