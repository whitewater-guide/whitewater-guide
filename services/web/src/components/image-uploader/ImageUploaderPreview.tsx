import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { LocalPhotoStatus } from '@whitewater-guide/clients';
import { MediaKind } from '@whitewater-guide/commons';
import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';
import { LocalPhoto } from '../../utils/files';
import { Lightbox, LightboxItem } from '../lightbox';

const useStyles = makeStyles(({ spacing }) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: spacing(),
      minHeight: 100,
    },
    imageBase: ({
      width,
      height,
      previewScale,
    }: ImageUploaderPreviewProps) => ({
      width: (typeof width === 'number' ? width : width[1]) * previewScale,
      height: (typeof height === 'number' ? height : height[1]) * previewScale,
    }),
    noImage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#BBBBBB',
      borderStyle: 'dashed',
      backgroundColor: 'white',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'scale-down',
      cursor: 'pointer',
    },
  }),
);

export interface ImageUploaderPreviewProps {
  value: LocalPhoto | null;
  width: number | [number, number];
  height: number | [number, number];
  previewScale: number;
}

export const ImageUploaderPreview = React.memo(
  (props: ImageUploaderPreviewProps) => {
    const { value } = props;
    const classes = useStyles(props);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const { src, lightbox } = useMemo(() => {
      const file = value ? value.file : undefined;
      const url = value ? value.url : undefined;
      const source = url ? url : file ? file.preview : undefined;
      const items: LightboxItem[] = [
        {
          copyright: null,
          description: null,
          id: null,
          kind: MediaKind.photo,
          image: source,
        },
      ];
      return { src: source, lightbox: items };
    }, [value]);

    const openLightbox = useCallback(() => {
      if (src) {
        setLightboxIndex(0);
      }
    }, [setLightboxIndex, src]);

    const closeLightbox = useCallback(() => {
      setLightboxIndex(null);
    }, [setLightboxIndex]);

    if (!value || value.status === LocalPhotoStatus.UPLOADING) {
      return (
        <div className={classes.root}>
          <div className={clsx(classes.imageBase, classes.noImage)}>
            {value ? <CircularProgress /> : <span>No Image</span>}
          </div>
        </div>
      );
    }
    return (
      <div className={classes.root}>
        <div className={classes.imageBase}>
          <img className={classes.image} src={src} onClick={openLightbox} />
          <Lightbox
            items={lightbox}
            currentModal={lightboxIndex}
            onClose={closeLightbox}
          />
        </div>
      </div>
    );
  },
);

ImageUploaderPreview.displayName = 'ImageUploaderPreview';
