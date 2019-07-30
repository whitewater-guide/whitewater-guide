import { BoomPromoInfo } from '@whitewater-guide/commons';
import ApolloClient from 'apollo-client';
import React from 'react';
import { withApollo } from 'react-apollo';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from '../../utils';
import { CHECK_BOOM_PROMO_QUERY, Result, Vars } from './checkBoomPromo.query';
import EnterCodeView from './EnterCodeView';

interface WithApollo {
  client: ApolloClient<any>;
}

interface Props {
  next: (info: BoomPromoInfo) => void;
  prev: () => void;
}

interface State {
  value: string;
  loading: boolean;
  error: string | null;
}

class EnterCodeStep extends React.PureComponent<
  Props & WithTranslation & WithApollo,
  State
> {
  readonly state: State = {
    value: '',
    loading: false,
    error: null,
  };

  onChange = (e: any) => {
    this.setState({ value: e.target.value, error: null });
  };

  onNext = async () => {
    this.setState({ loading: true, error: null });
    const { error, promo } = await this.checkPromoCode();
    if (promo) {
      this.reset();
      this.props.next(promo);
    } else {
      this.setState({ loading: false, error });
    }
  };

  onPrev = () => {
    this.reset();
    this.props.prev();
  };

  reset = () => {
    this.setState({ value: '', error: null, loading: false });
  };

  checkPromoCode = async () => {
    const { client, t } = this.props;
    const { value } = this.state;
    let promo: BoomPromoInfo | null = null;
    let error: string | null = null;
    try {
      const { data, errors } = await client.query<Result, Vars>({
        query: CHECK_BOOM_PROMO_QUERY,
        variables: { code: value },
        fetchPolicy: 'network-only',
      });
      promo = data ? data.checkBoomPromo : null;
      const hasErrors = errors && errors.length > 0;
      if (promo) {
        if (promo.redeemed) {
          error = t('enter:errors.redeemed');
          promo = null;
        } else if (hasErrors) {
          error = t('enter:errors.graphqlErrors');
        }
      } else {
        error = t('enter:errors.badCode');
      }
    } catch (e) {
      error = t('enter:errors.network');
    }
    return { promo, error };
  };

  render() {
    const {
      client,
      next,
      prev,
      t,
      tReady,
      i18n,
      ...stepContentProps
    } = this.props;
    const { value, error, loading } = this.state;
    return (
      <EnterCodeView
        {...stepContentProps}
        onChange={this.onChange}
        value={value}
        error={error}
        loading={loading}
        next={this.onNext}
        prev={this.onPrev}
      />
    );
  }
}

export default compose(
  withApollo,
  withTranslation(),
)(EnterCodeStep);
