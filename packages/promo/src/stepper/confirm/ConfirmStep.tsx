import { useMyProfileQuery } from '@whitewater-guide/clients';
import { BoomPromoInfo } from '@whitewater-guide/schema';
import React, { FC, useState } from 'react';

import { PromoRegionFragment } from '../promoRegion.generated';
import ConfirmStepView from './ConfirmStepView';
import useActivatePromo from './useActivatePromo';

interface State {
  error?: string;
  loading: boolean;
  success: boolean;
}

interface Props {
  prev: () => void;
  region: PromoRegionFragment | null;
  promo: BoomPromoInfo | null;
}

const ConfirmStep: FC<Props> = (props) => {
  const { region, promo, prev, ...stepContentProps } = props;
  const [state, setState] = useState<State>({ loading: false, success: false });
  const { data } = useMyProfileQuery();
  const activatePromo = useActivatePromo(region, promo!);
  const username = data?.me?.name;

  const onNext = async () => {
    setState({ loading: true, error: undefined, success: false });
    const { error, success } = await activatePromo();
    setState({ loading: false, error, success });
  };

  const onPrev = () => {
    setState({ loading: false, success: false, error: undefined });
    prev();
  };

  return (
    <ConfirmStepView
      success={state.success}
      region={region}
      promo={promo!}
      username={username}
      loading={state.loading}
      error={state.error}
      onNext={onNext}
      onPrev={onPrev}
      {...stepContentProps}
    />
  );
};

export default ConfirmStep;
