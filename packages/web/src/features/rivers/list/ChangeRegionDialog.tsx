import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { NamedNode } from '@whitewater-guide/schema';
import React, { memo, useState } from 'react';

import { RegionFinder } from '../../../components';
import { useChangeRiverRegionMutation } from './changeRiverRegion.generated';

interface Props {
  riverId?: string | null;
  open: boolean;
  onCancel: () => void;
}

const ChangeRegionDialog = memo<Props>(({ riverId, open, onCancel }) => {
  const [region, setRegion] = useState<NamedNode | null>(null);
  const [mutate, { loading }] = useChangeRiverRegionMutation({
    refetchQueries: ['listRivers'],
  });

  const handleCancel = () => {
    setRegion(null);
    onCancel();
  };

  const handleSubmit = () => {
    if (riverId && region) {
      mutate({
        variables: { riverId, regionId: region.id },
      }).then(() => handleCancel());
    }
  };

  const disabled = loading || !region;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg">
      <DialogTitle>Change River&lsquo;s Region</DialogTitle>
      <DialogContent>
        <RegionFinder value={region} onChange={setRegion} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button color="primary" disabled={disabled} onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default ChangeRegionDialog;
