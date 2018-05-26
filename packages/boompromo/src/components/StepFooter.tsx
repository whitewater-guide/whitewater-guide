import Button from '@material-ui/core/Button';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import React from 'react';
import { NextButton } from './NextButton';

type ClassNames = 'prevButton' | 'actionsContainer';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  prevButton: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
});

interface Props extends WithStyles<ClassNames> {
  nextData?: any;
  nextDisabled: boolean;
  nextLoading: boolean;
  nextLabel?: string;
  onNext?: (data?: any) => void;
  prevLabel?: string;
  onPrev?: () => void;
}

const StepFooterInner: React.SFC<Props> = (props) => {
  const {
    classes,
    nextData,
    nextDisabled,
    nextLabel,
    nextLoading,
    onNext,
    prevLabel = 'Назад',
    onPrev,
  } = props;
  return (
    <div className={classes.actionsContainer}>
      <div>
        {
          onPrev &&
          <Button onClick={onPrev} className={classes.prevButton}>
            {prevLabel}
          </Button>
        }
        {
          onNext &&
          <NextButton
            loading={nextLoading}
            disabled={nextDisabled}
            onClick={() => onNext(nextData)}
            label={nextLabel}
          />
        }
      </div>
    </div>
  );
};

export const StepFooter = withStyles(styles)(StepFooterInner);
