import { NamedNode } from '@whitewater-guide/schema';
import noop from 'lodash/noop';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Dialog, Subheading } from 'react-native-paper';

import theme from '../../../theme';
import { OfflineProgress } from '../types';
import { Categories } from './categories';
import DialogActions from './DialogActions';
import LoadingSummary from './LoadingSummary';
import useDialogSelection from './useDialogSelection';
import useMediaSummary from './useMediaSummary';
import Warnings from './Warnings';

const styles = StyleSheet.create({
  root: {
    marginBottom: theme.margin.double,
    marginHorizontal: theme.margin.double,
    justifyContent: 'space-between',
  },
  subtitle: {
    marginTop: 0,
    marginBottom: theme.margin.double,
    paddingTop: 0,
    marginHorizontal: theme.margin.triple,
  },
});

interface Props {
  region: NamedNode;
  inProgress?: boolean;
  progress: OfflineProgress;
  error?: Error;
}

const OfflineContentDialogView: React.FC<Props> = React.memo((props) => {
  const { region, inProgress, progress, error } = props;
  const { t } = useTranslation();
  const [selection, toggleCategory] = useDialogSelection();
  const summary = useMediaSummary(region.id);
  return (
    <Dialog dismissable={false} onDismiss={noop} visible>
      <Dialog.Title testID="offline-dialog-title">
        {t('offline:dialog.title', { region: region ? region.name : '' })}
      </Dialog.Title>
      <Subheading style={styles.subtitle}>
        {t('offline:dialog.subtitle', { region: region ? region.name : '' })}
      </Subheading>
      {summary.summary ? (
        <View style={styles.root}>
          <Categories
            summary={summary.summary}
            inProgress={inProgress}
            progress={progress}
            selection={selection}
            onToggleCategory={toggleCategory}
          />
          <Warnings error={error} />
        </View>
      ) : (
        <LoadingSummary error={summary.error} refetch={summary.refetch} />
      )}
      <Dialog.Actions>
        <DialogActions
          canDownload={!!summary.summary}
          selection={selection}
          regionId={region.id}
          inProgress={inProgress}
          error={error}
        />
      </Dialog.Actions>
    </Dialog>
  );
});

OfflineContentDialogView.displayName = 'OfflineContentDialogView';

export default OfflineContentDialogView;
