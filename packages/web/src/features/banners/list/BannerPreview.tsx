import { createStyles, makeStyles } from '@material-ui/core/styles';
import { BannerResolutions } from '@whitewater-guide/clients';
import { BannerKind, BannerPlacement } from '@whitewater-guide/schema';
import React from 'react';
import Iframe from 'react-iframe';

import { ListedBannerFragment } from './listBanners.generated';

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
  source: ListedBannerFragment['source'];
}

export const BannerPreview = React.memo<Props>(({ placement, source }) => {
  const { url, kind } = source;
  const height = Math.ceil(BannerResolutions[placement][1] / 2);
  const classes = useStyles();
  return (
    <div className={classes.container}>
      {kind === BannerKind.Image ? (
        <img alt="" className={classes.image} src={url} />
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
});

BannerPreview.displayName = 'BannerPreview';

export default BannerPreview;
