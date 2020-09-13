import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NamedNode } from '@whitewater-guide/commons';
import React, { useState } from 'react';

import { ButtonProgress } from '../../../components';
import { SectionFinder } from '../../../components/SectionFinder';
import { useMergeSource } from './MergeSectionsProvider';
import useMergeSections from './useMergeSections';

interface Props {
  regionId?: string;
}

const MergeSectionsDialog = React.memo(({ regionId }: Props) => {
  const { source, setSource } = useMergeSource();
  const { mergeSections, loading } = useMergeSections();
  const [destination, setDestination] = useState<NamedNode | null>(null);

  const onMerge = () => {
    if (source && destination) {
      mergeSections(source.id, destination.id)
        .catch(() => {})
        .finally(() => {
          setSource(null);
        });
    }
  };

  if (!source) {
    return null;
  }

  return (
    <Dialog
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      maxWidth="xs"
      aria-labelledby="merge-sections-dialog-title"
      open={true}
    >
      <DialogTitle id="merge-sections-dialog-title">Merge section</DialogTitle>

      <DialogContent>
        <DialogContentText component="div">
          The section <b>{`${source.river.name} - ${source.name}`}</b> will be
          irretrievably deleted. The following attributes will be merged into
          the section you select below:
          <ul>
            <li>logbook entries (for all users)</li>
            <li>media</li>
            <li>POIs</li>
          </ul>
        </DialogContentText>
        <SectionFinder
          allowNull={true}
          value={destination}
          onChange={setDestination}
          regionId={regionId}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setSource(null)}>Cancel</Button>
        <ButtonProgress loading={loading}>
          <Button
            color="primary"
            disabled={!destination || loading}
            onClick={onMerge}
          >
            Merge it
          </Button>
        </ButtonProgress>
      </DialogActions>
    </Dialog>
  );
});

MergeSectionsDialog.displayName = 'MergeSectionsDialog';

export default MergeSectionsDialog;
