import { WithMe, withMe } from '@whitewater-guide/clients';
import {
  BoomPromoInfo,
  PurchaseInput,
  PurchasePlatform,
  Region,
} from '@whitewater-guide/commons';
import ApolloClient from 'apollo-client';
import React from 'react';
import { withApollo } from 'react-apollo';
import { WithTranslation, withTranslation } from 'react-i18next';

import { compose } from '../../utils';
import {
  ACTIVATE_PROMO_MUTATION,
  Result,
  Vars,
} from './activatePromo.mutation';
import ConfirmStepView from './ConfirmStepView';

interface WithApollo {
  client: ApolloClient<any>;
}

interface Props {
  prev: () => void;
  region: Region | null;
  promo: BoomPromoInfo;
}

interface State {
  error?: string;
  loading: boolean;
  success: boolean;
}

class ConfirmStep extends React.Component<
  Props & WithMe & WithTranslation & WithApollo,
  State
> {
  readonly state: State = { loading: false, success: false };

  onNext = async () => {
    this.setState({ loading: true, error: undefined, success: false });
    const { error, success } = await this.activatePromo();
    this.setState({ loading: false, error, success });
  };

  onPrev = () => {
    this.setState({ loading: false, success: false, error: undefined });
    this.props.prev();
  };

  activatePromo = async () => {
    const { region, promo, client, t } = this.props;
    const purchase: PurchaseInput = {
      platform: PurchasePlatform.boomstarter,
      transactionId: promo.code,
      productId: promo.groupSku || region!.sku!,
    };
    let success = false;
    let error: string | undefined;
    try {
      const { data, errors } = await client.mutate<Result, Vars>({
        mutation: ACTIVATE_PROMO_MUTATION,
        variables: { purchase },
      });
      success = data ? !!data.savePurchase : false;
      const hasErrors = errors && errors.length > 0;
      if (hasErrors) {
        console.error(errors);
      }
      error = success ? undefined : t('confirm:errors.badCode');
    } catch (e) {
      error = t('confirm:errors.network');
    }
    return { error, success };
  };

  render() {
    const {
      region,
      promo,
      me,
      prev: _prev,
      t: _t,
      tReady: _tReady,
      i18n: _i18n,
      ...stepContentProps
    } = this.props;
    const { error, loading, success } = this.state;
    const username = me && me.name;
    return (
      <ConfirmStepView
        success={success}
        region={region}
        promo={promo}
        username={username}
        loading={loading}
        error={error}
        onNext={this.onNext}
        onPrev={this.onPrev}
        {...stepContentProps}
      />
    );
  }
}

export default compose(withApollo, withMe, withTranslation())(ConfirmStep);
