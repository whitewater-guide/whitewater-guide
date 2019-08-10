import { createStyles, makeStyles } from '@material-ui/core/styles';
import { BannerInput } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React from 'react';
import debounceRender from 'react-debounce-render';
import Iframe from 'react-iframe';
import { NumberField, TextField } from '../../../../formik/fields';

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
  const { values } = useFormikContext<BannerInput>();
  const url = values.source.src;
  const ratio = values.source.ratio || 4;
  return (
    <div className={classes.root}>
      <div className={classes.inputs}>
        <NumberField name="source.ratio" label="Ratio" placeholder="Ratio" />
        <TextField
          fullWidth={true}
          name="source.src"
          label="URL"
          placeholder="URL"
        />
      </div>
      <div className={classes.iframe} style={{ height: 512 / ratio }}>
        {!!url && (
          <DebouncedIframe
            width="512px"
            height={`${Math.ceil(512 / ratio)}px`}
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
