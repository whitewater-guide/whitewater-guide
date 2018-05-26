import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Step, { StepProps } from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core/styles';
import { GraphQLError } from 'graphql';
import React from 'react';
import { Omit } from 'type-zoo';
import { StepFooter } from '../../components';
import { BoomPromoInfo } from '../../ww-commons/features/purchases';
import Query from './Query';

type ClassNames = 'formControl';

const styles: StyleRulesCallback<ClassNames> = (theme) => ({
  formControl: {
    margin: theme.spacing.unit,
  },
});

interface Props extends Omit<StepProps, 'classes'>, WithStyles<ClassNames> {
  onPrev: () => void;
  onNext: () => void;
}

interface State {
  code: string;
  error?: string;
}

class InputStep extends React.PureComponent<Props, State> {
  state: State = { code: '' };

  onChange = (e: any) => {
    this.setState({ code: e.target.value });
  };

  onLoaded = (data: BoomPromoInfo | null, errors?: GraphQLError[]) => {
    if (errors && errors.length > 0) {
      this.setState({ error: 'Упс! Что-то сломалось. Попробуйте заново' });
    } else if (!data) {
      this.setState({ error: 'Похоже этот промо код не подходит ' });
    } else {
      this.setState({ error: undefined });
      this.props.onNext();
    }
  };

  render() {
    const { classes, onPrev, onNext, ...stepProps } = this.props;
    const { code, error } = this.state;
    return (
      <Step {...stepProps}>
        <StepLabel>Введите промо код</StepLabel>
        <StepContent>
          <FormControl className={classes.formControl} error={!!error}>
            <InputLabel htmlFor="name-simple">Промо код</InputLabel>
            <Input id="name-simple" value={code} onChange={this.onChange} />
            <FormHelperText id="name-error-text">{error}</FormHelperText>
          </FormControl>
          <Query code={code} onLoaded={this.onLoaded}>
            {({ checkBoomPromo, loading }) => (
              <StepFooter
                onPrev={onPrev}
                onNext={checkBoomPromo}
                nextDisabled={code.length !== 8}
                nextLoading={loading}
              />
            )}
          </Query>
        </StepContent>
      </Step>
    );
  }
}

export default withStyles(styles)(InputStep);
