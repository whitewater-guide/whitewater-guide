import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  BannerKind,
  BannerPlacement,
  BannerResolutions,
} from '@whitewater-guide/commons';
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
  placement: BannerPlacement;
  value: BannerKind;
  onChange: (value: BannerKind) => void;
}

const BannerKindField: React.FC<Props> = React.memo((props) => {
  const { title, value, onChange, placement } = props;
  const [width, height] = BannerResolutions.get(placement)!;
  const classes = useStyles();

  const onRadioChange = useCallback(
    (e: any) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={classes.container}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{`${title} (${width}x${height})`}</FormLabel>
        <RadioGroup
          aria-label={title}
          name="source_kind"
          value={value}
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

BannerKindField.displayName = 'BannerKindSelector';

export default BannerKindField;
