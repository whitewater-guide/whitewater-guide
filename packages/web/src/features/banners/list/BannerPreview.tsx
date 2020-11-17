import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  BannerKind,
  BannerPlacement,
  BannerResolutions,
  BannerSource,
} from '@whitewater-guide/commons';
import React from 'react';
import Iframe from 'react-iframe';

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: 512,
      height: 171,
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'scale-down',
    },
  }),
);

interface Props {
  placement: BannerPlacement;
  source: BannerSource;
}

export const BannerPreview: React.FC<Props> = React.memo(
  ({ placement, source }) => {
    const { url, kind } = source;
    const height = Math.ceil(BannerResolutions.get(placement)![1] / 2);
    const classes = useStyles();
    return (
      <div className={classes.container}>
        {kind === BannerKind.Image ? (
          <img className={classes.image} src={url} />
        ) : (
          <Iframe
            width="512px"
            height={`${height}px`}
            url={url}
            styles={{ overflow: 'hidden' }}
          />
        )}
      </div>
    );
  },
);

BannerPreview.displayName = 'BannerPreview';

export default BannerPreview;
