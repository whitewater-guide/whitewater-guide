import React from 'react';
import { translate, withI18n, WithI18n } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { analytics } from 'react-native-firebase';
import { Button, Caption, Dialog, Subheading } from 'react-native-paper';
import { RetryPlaceholder } from '../../../components';
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
    height: 2 * theme.rowHeight,
    paddingHorizontal: theme.margin.single,
  },
  offlinePlaceholderContainer: {
    height: 5 * theme.rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.margin.double,
  },
  subtitle: {
    marginTop: 0,
    marginBottom: theme.margin.double,
    paddingTop: 0,
    marginHorizontal: theme.margin.triple,
  },
  okButton: {
    marginLeft: theme.margin.single,
    minWidth: 80,
  },
});

type Props = InnerProps & WithI18n;

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

  componentDidMount() {
    const { region } = this.props;
    if (region) {
      analytics().logEvent('offline_dialog', { region: region.id });
    }
  }

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
    const photoSize =
      summary && summary.summary ? summary.summary.photo.size : undefined;
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
          progress={progress.maps}
          onToggle={this.onToggleCategory}
          label={t('offline:dialog.categories.maps')}
        />
        <View style={styles.cacheWarningContainer}>
          <Caption>{t('offline:dialog:cacheWarning')}</Caption>
        </View>
      </View>
    );
  };

  renderLoadingSummary = () => {
    const { t, summary, i18n } = this.props;
    return <LoadingSummary t={t} summary={summary} i18n={i18n} />;
  };

  renderOffline = () => (
    <View style={styles.offlinePlaceholderContainer}>
      <RetryPlaceholder />
    </View>
  );

  renderReadyButtons = () => {
    const { onDismiss, isConnected = true, summary, t } = this.props;
    return (
      <Dialog.Actions>
        <Button mode="outlined" onPress={onDismiss}>
          {t('commons:cancel')}
        </Button>
        <Button
          mode="contained"
          disabled={!isConnected || !!summary.error || summary.loading}
          onPress={this.onDownload}
          style={styles.okButton}
        >
          {t('offline:dialog.download')}
        </Button>
      </Dialog.Actions>
    );
  };

  renderInProgressButtons = () => {
    const { onDismiss, t } = this.props;
    return (
      <Dialog.Actions>
        <Button mode="outlined" onPress={onDismiss}>
          {t('offline:dialog.inBackground')}
        </Button>
      </Dialog.Actions>
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
        <Dialog.Title>
          {t('offline:dialog.title', { region: region.name })}
        </Dialog.Title>
        <Subheading style={styles.subtitle}>
          {t('offline:dialog.subtitle', { region: region.name })}
        </Subheading>
        {this.renderBody()}
        {inProgress
          ? this.renderInProgressButtons()
          : this.renderReadyButtons()}
      </React.Fragment>
    );
  }
}

export default withI18n()(OfflineContentDialogView);
