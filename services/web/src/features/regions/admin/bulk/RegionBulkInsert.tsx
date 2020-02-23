import { Checkbox, FormControlLabel } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { ButtonProgress } from '../../../../components';
import useBulkInsert from './useBulkInsert';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    log: {
      whiteSpace: 'pre-line',
      overflow: 'scroll',
      flex: 1,
    },
  }),
);

interface Props {
  regionId: string;
}

export const RegionBulkInsert: React.FC<Props> = ({ regionId }) => {
  const classes = useStyles();
  const [hidden, setHidden] = useState(true);
  const { insert, log, loading } = useBulkInsert(regionId);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      insert(acceptedFiles[0], hidden);
    },
    [insert, hidden],
  );

  return (
    <div className={classes.root}>
      <Dropzone onDrop={onDrop} multiple={false} accept=".gz">
        {({ getRootProps, getInputProps }) => {
          return (
            <div {...getRootProps()}>
              <ButtonProgress loading={loading}>
                <Button color="primary" variant="contained" disabled={loading}>
                  <Icon className={clsx('material-icons', classes.icon)}>
                    cloud_upload
                  </Icon>
                  {'Upload .tar.gz file'}
                  <input {...getInputProps()} />
                </Button>
              </ButtonProgress>
            </div>
          );
        }}
      </Dropzone>
      <FormControlLabel
        control={
          <Checkbox
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
          />
        }
        label="Hidden"
      />
      {!!log && <div className={classes.log}>{log}</div>}
    </div>
  );
};
