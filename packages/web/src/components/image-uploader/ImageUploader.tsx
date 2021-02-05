import { createStyles, makeStyles } from '@material-ui/core/styles';
import { i18nizeUploadError, useUploadLink } from '@whitewater-guide/clients';
import clsx from 'clsx';
import React, { useCallback, useEffect, useRef } from 'react';
import { Required } from 'utility-types';

import { cleanupPreview, LocalPhoto } from '../../utils/files';
import { DeleteButton } from '../DeleteButton';
import AddFile from './AddFile';
import Filename from './Filename';
import {
  ImageUploaderPreview,
  ImageUploaderPreviewProps,
} from './ImageUploaderPreview';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 0,
      width: 'max-content',
      padding: spacing(),
      paddingLeft: 0,
    },
    main: {
      display: 'flex',
      padding: spacing(),
      flexGrow: 0,
      borderWidth: 1,
      borderColor: '#BBBBBB',
      borderStyle: 'solid',
    },
    buttons: {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: spacing(),
      paddingRight: spacing(),
      alignItems: 'center',
      justifyContent: 'center',
    },
  }),
);

export interface ImageUploaderProps extends ImageUploaderPreviewProps {
  onChange: (value: LocalPhoto | null) => void;
  hideFileName?: boolean;
  title?: string;
  classes?: {
    root?: string;
    main?: string;
  };
  mpxOrResolution?: number | [number, number];
}

export const ImageUploader: React.FC<ImageUploaderProps> = React.memo(
  (props) => {
    const {
      value,
      onChange,
      title,
      hideFileName,
      classes = {},
      width,
      height,
      previewScale,
      mpxOrResolution,
    } = props;
    const classez = useStyles();
    const prev = useRef(value);
    const { upload } = useUploadLink();

    useEffect(() => {
      if (prev.current !== value && prev.current && prev.current.file) {
        cleanupPreview(prev.current.file);
      }
      prev.current = value;
    }, [value]);

    const handleDelete = useCallback(() => onChange(null), [onChange]);

    const handleChange = useCallback(
      (v: Required<LocalPhoto, 'file'>) => {
        onChange(v);
        if (!v.error) {
          upload(v.file)
            .then((url) => {
              onChange({ ...v, url });
            })
            .catch((e) => {
              onChange({ ...v, error: i18nizeUploadError(e) });
            });
        }
      },
      [onChange, upload],
    );

    return (
      <div className={clsx(classez.root, classes.root)}>
        {!!title && (
          <span>
            <strong>{title}</strong>
          </span>
        )}
        {!hideFileName && <Filename value={value} />}
        <div className={clsx(classez.main, classes.main)}>
          <ImageUploaderPreview
            value={value}
            width={width}
            height={height}
            previewScale={previewScale}
          />
          <div className={classez.buttons}>
            <DeleteButton id="img" deleteHandler={handleDelete} />
            <AddFile onAdd={handleChange} mpxOrResolution={mpxOrResolution} />
          </div>
        </div>
      </div>
    );
  },
);

ImageUploader.displayName = 'ImageUploader';
