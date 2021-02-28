import Button from '@material-ui/core/Button';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { NextButton } from './NextButton';

const styles = (theme: Theme) =>
  createStyles({
    prevButton: {
      marginRight: theme.spacing(),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles> {
  nextData?: any;
  nextDisabled: boolean;
  nextLoading: boolean;
  nextLabel?: string;
  onNext?: (data?: any) => void;
  prevLabel?: string;
  onPrev?: () => void;
}

const StepFooterInner: React.FC<Props> = (props) => {
  const {
    classes,
    nextDisabled,
    nextLabel,
    nextData,
    nextLoading,
    onNext,
    prevLabel,
    onPrev,
  } = props;
  const onClick = useCallback(() => {
    if (onNext) {
      onNext(nextData);
    }
  }, [onNext, nextData]);
  const { t } = useTranslation();
  return (
    <div className={classes.actionsContainer}>
      <div>
        {onPrev && (
          <Button onClick={onPrev} className={classes.prevButton}>
            {prevLabel || t('main:prevStepButton')}
          </Button>
        )}
        {!!onNext && (
          <NextButton
            loading={nextLoading}
            disabled={nextDisabled}
            onClick={onClick}
            label={nextLabel}
          />
        )}
      </div>
    </div>
  );
};

export const StepFooter = withStyles(styles)(StepFooterInner);
