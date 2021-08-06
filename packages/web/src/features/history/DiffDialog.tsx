import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { FC, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';

import { Loading } from '../../components';
import { Styles } from '../../styles';
import { Diff } from './types';

const styles: Styles = {
  wrapper: {
    maxHeight: 600,
    overflowY: 'auto',
  },
};

interface Props {
  diff: Diff;
  onRequestClose: () => void;
}

interface State {
  jsondiffpatch: any;
}

export const DiffDialog: FC<Props> = ({ diff, onRequestClose }) => {
  const [jsonDiffPatch, setJsonDiffPatch] = useState<any>(null);

  useAsync(async () => {
    // @ts-ignore
    await import('jsondiffpatch/dist/formatters-styles/html.css');
    const diffModule = await import('jsondiffpatch');
    setJsonDiffPatch(diffModule);
  }, [setJsonDiffPatch]);

  let innerHtml: any = null;
  if (jsonDiffPatch) {
    innerHtml = { __html: jsonDiffPatch.formatters.html.format(diff) };
  }
  return (
    <Dialog open onClose={onRequestClose}>
      <DialogTitle>View diff</DialogTitle>
      <DialogContent>
        {innerHtml ? (
          <div style={styles.wrapper} dangerouslySetInnerHTML={innerHtml} />
        ) : (
          <Loading />
        )}
      </DialogContent>
      <DialogActions>
        <Button key="closeButton" color="primary" onClick={onRequestClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
