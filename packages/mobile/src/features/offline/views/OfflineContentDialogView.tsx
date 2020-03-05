import { NamedNode } from '@whitewater-guide/commons';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Dialog, Subheading } from 'react-native-paper';
import theme from '../../../theme';
import {
  REGION_MEDIA_SUMMARY,
  Result,
  Vars,
} from '../regionMediaSummary.query';
import {
  OfflineCategorySelection,
  OfflineCategoryType,
  OfflineProgress,
} from '../types';
import { Categories } from './categories';
import DialogActions from './DialogActions';
import LoadingSummary from './LoadingSummary';
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
  error?: string | null;
}

const OfflineContentDialogView: React.FC<Props> = React.memo((props) => {
  const { region, inProgress, progress, error } = props;
  const summary = useQuery<Result, Vars>(REGION_MEDIA_SUMMARY, {
    fetchPolicy: 'network-only',
    variables: { regionId: region.id },
  });
  const data =
    summary.data && summary.data.region && summary.data.region.mediaSummary;
  const { t } = useTranslation();
  const [selection, setSelection] = useState<OfflineCategorySelection>({
    data: true,
    media: false,
    maps: false,
  });
  const onToggleCategory = useCallback(
    (type: OfflineCategoryType, value: boolean) => {
      setSelection({ ...selection, [type]: value });
    },
    [selection, setSelection],
  );
  const canDownload = !summary.loading && !!data;
  if (!region) {
    return null;
  }
  return (
    <React.Fragment>
      <Dialog.Title testID="offline-dialog-title">
        {t('offline:dialog.title', { region: region ? region.name : '' })}
      </Dialog.Title>
      <Subheading style={styles.subtitle}>
        {t('offline:dialog.subtitle', { region: region ? region.name : '' })}
      </Subheading>
      {canDownload ? (
        <View style={styles.root}>
          <Categories
            summary={data!}
            inProgress={inProgress}
            progress={progress}
            selection={selection}
            onToggleCategory={onToggleCategory}
          />
          <Warnings error={error} />
        </View>
      ) : (
        <LoadingSummary error={summary.error} refetch={summary.refetch} />
      )}
      <DialogActions
        canDownload={canDownload}
        selection={selection}
        regionId={region.id}
        inProgress={inProgress}
      />
    </React.Fragment>
  );
});

OfflineContentDialogView.displayName = 'OfflineContentDialogView';

export default OfflineContentDialogView;
