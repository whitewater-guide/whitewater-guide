import { createStyles, makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ToggleButton from '@material-ui/lab/ToggleButton';
import React, { useCallback } from 'react';

import type { GoogleMapControlProps } from '../../../components/maps/GoogleMap';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: 40,
    },
    container: {
      marginRight: 10,
      marginTop: 10,
      backgroundColor: 'white',
    },
  }),
);

interface Props extends GoogleMapControlProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const GaugesMapSwitch: React.FC<Props> = ({ enabled, setEnabled }) => {
  const onChange = useCallback(() => {
    setEnabled((e) => !e);
  }, [setEnabled]);

  const { container, ...classes } = useStyles();

  return (
    <div className={container}>
      <ToggleButton
        value="check"
        selected={enabled}
        onChange={onChange}
        classes={classes}
      >
        <CheckIcon />
        Show gauges
      </ToggleButton>
    </div>
  );
};

export default GaugesMapSwitch;
