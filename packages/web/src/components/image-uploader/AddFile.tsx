import { createStyles, makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon/SvgIcon';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Required } from 'utility-types';

import { LocalPhoto, toLocalPhoto } from '../../utils/files';

const useStyles = makeStyles((theme) =>
  createStyles({
    dz: {
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
    },
  }),
);

interface Props {
  onAdd: (value: Required<LocalPhoto, 'file'>) => void;
  mpxOrResolution?: number | [number, number];
}

export const AddFile: React.FC<Props> = ({ onAdd, mpxOrResolution }) => {
  const classes = useStyles();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      toLocalPhoto(acceptedFiles[0], mpxOrResolution).then(onAdd);
    },
    [onAdd, mpxOrResolution],
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div {...getRootProps()} className={classes.dz}>
      <input {...getInputProps()} />
      <SvgIcon>
        <path
          fill="#333333"
          d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"
        />
      </SvgIcon>
    </div>
  );
};

export default AddFile;
