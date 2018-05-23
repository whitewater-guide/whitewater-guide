import Button from '@material-ui/core/Button';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import React from 'react';

type ClassNames = 'button' | 'icon';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  icon: {
    marginRight: theme.spacing.unit,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    color: '#FFFFFF',
    backgroundColor: '#3B5998',
    '&:hover': {
      backgroundColor: '#003069',
    },
  },
});

interface Props extends WithStyles<ClassNames> {
  onClick: () => void;
  label: string;
}

const FacebookButton: React.SFC<Props> = ({ onClick, label, classes }) => (
  <Button
    className={classes.button}
    variant="raised"
    color="primary"
    onClick={onClick}
  >
    <SvgIcon className={classes.icon}>
      {/* tslint:disable-next-line:max-line-length */}
      <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M18,5H15.5A3.5,3.5 0 0,0 12,8.5V11H10V14H12V21H15V14H18V11H15V9A1,1 0 0,1 16,8H18V5Z" />
    </SvgIcon>
    {label}
  </Button>
);

export default withStyles(styles)(FacebookButton);
