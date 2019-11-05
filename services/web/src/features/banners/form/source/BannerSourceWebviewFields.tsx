import { createStyles, makeStyles } from '@material-ui/core/styles';
import { BannerResolutions } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React from 'react';
import debounceRender from 'react-debounce-render';
import Iframe from 'react-iframe';
import { TextField } from '../../../../formik/fields';
import { BannerFormData } from '../types';

const DebouncedIframe = debounceRender(Iframe);

const useStyles = makeStyles(({ spacing, palette }) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: spacing(1),
    },
    inputs: {
      display: 'flex',
      flexDirection: 'row',
    },
    iframe: {
      width: 512,
      backgroundColor: palette.grey[200],
    },
  }),
);

const BannerSourceWebviewFields: React.FC = React.memo(() => {
  const classes = useStyles();
  const { values } = useFormikContext<BannerFormData>();
  const [_, height] = BannerResolutions.get(values.placement)!;
  const url = values.source;
  return (
    <div className={classes.root}>
      <div className={classes.inputs}>
        <TextField
          fullWidth={true}
          name="source"
          label="URL"
          placeholder="URL"
        />
      </div>
      <div className={classes.iframe} style={{ height: Math.ceil(height / 2) }}>
        {!!url && (
          <DebouncedIframe
            width="512px"
            height={`${Math.ceil(height / 2)}px`}
            url={url}
            styles={{ overflow: 'hidden' }}
          />
        )}
      </div>
    </div>
  );
});

BannerSourceWebviewFields.displayName = 'BannerSourceWebviewFields';

export default BannerSourceWebviewFields;
