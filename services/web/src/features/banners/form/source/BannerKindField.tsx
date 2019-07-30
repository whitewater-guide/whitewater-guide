import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { BannerInput, BannerKind } from '@whitewater-guide/commons';
import { useFormikContext } from 'formik';
import React, { useCallback } from 'react';

const useStyles = makeStyles(({ spacing, palette }) =>
  createStyles({
    container: {
      padding: spacing(2),
      backgroundColor: palette.grey[50],
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
  }),
);

interface Props {
  title?: string;
}

const BannerKindField: React.FC<Props> = React.memo((props) => {
  const { title } = props;
  const { values, setFieldValue } = useFormikContext<BannerInput>();
  const classes = useStyles();

  const onRadioChange = useCallback(
    (e: any) => {
      setFieldValue(`source.kind` as any, e.target.value);
    },
    [setFieldValue],
  );

  return (
    <div className={classes.container}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{title}</FormLabel>
        <RadioGroup
          aria-label={title}
          name="source_kind"
          value={values.source.kind}
          onChange={onRadioChange}
        >
          <FormControlLabel
            value={BannerKind.Image}
            control={<Radio />}
            label="Image"
          />
          <FormControlLabel
            value={BannerKind.WebView}
            control={<Radio />}
            label="WebView"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
});

BannerKindField.displayName = 'BannerKindField';

export default BannerKindField;
