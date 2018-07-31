import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Caption, DialogActions, DialogTitle } from 'react-native-paper';
import { OfflineQueryPlaceholder } from '../../../components';
import { WithT } from '../../../i18n';
import theme from '../../../theme';
import { OfflineCategorySelection, OfflineCategoryType } from '../types';
import LoadingSummary from './LoadingSummary';
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
  offlinePlaceholderContainer: {
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
    const photoSize = (summary && summary.summary) ? summary.summary.photo.size : undefined;
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
    const { t, summary } = this.props;
    return (
      <LoadingSummary t={t} summary={summary} />
    );
  };

  renderOffline = () => (
    <View style={styles.offlinePlaceholderContainer}>
      <OfflineQueryPlaceholder />
    </View>
  );

  renderReadyButtons = () => {
    const { onDismiss, isConnected = true, summary, t } = this.props;
    return (
      <DialogActions>
        <Button raised onPress={onDismiss}>
          {t('commons:cancel')}
        </Button>
        <Button
          primary
          raised
          disabled={!isConnected || !!summary.error || summary.loading}
          onPress={this.onDownload}
        >
          {t('commons:ok')}
        </Button>
      </DialogActions>
    );
  };

  renderInProgressButtons = () => {
    const { onDismiss, t } = this.props;
    return (
      <DialogActions>
        <Button raised onPress={onDismiss}>
          {t('offline:dialog.inBackground')}
        </Button>
      </DialogActions>
    );
  };

  renderBody = () => {
    const { isConnected = true, summary } = this.props;
    if (!isConnected) {
      return this.renderOffline();
    }
    if (summary.loading || summary.error) {
      return this.renderLoadingSummary();
    }
    return this.renderCategories();
  };

  render() {
    const { region, inProgress, t } = this.props;
    if (!region) {
      return null;
    }
    return (
      <React.Fragment>
        <DialogTitle>{t('offline:dialog.title', { region: region.name })}</DialogTitle>
        {this.renderBody()}
        {inProgress ? this.renderInProgressButtons() : this.renderReadyButtons()}
      </React.Fragment>
    );
  }
}

export default translate()(OfflineContentDialogView);
