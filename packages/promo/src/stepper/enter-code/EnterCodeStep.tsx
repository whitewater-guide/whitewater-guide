import { useApolloClient } from '@apollo/client';
import type { StepProps } from '@material-ui/core/Step';
import type { BoomPromoInfo } from '@whitewater-guide/schema';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type {
  CheckBoomPromoQuery,
  CheckBoomPromoQueryVariables,
} from './checkBoomPromo.generated';
import { CheckBoomPromoDocument } from './checkBoomPromo.generated';
import EnterCodeView from './EnterCodeView';

type Props = Omit<StepProps, 'classes'> & {
  next: (info: BoomPromoInfo) => void;
  prev: () => void;
};

const EnterCodeStep: FC<Props> = ({ next, prev, ...stepContentProps }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient();

  const reset = () => {
    setCode('');
    setError(null);
    setLoading(false);
  };

  const checkPromoCode = async () => {
    let promo: BoomPromoInfo | null = null;
    let error: string | null = null;
    try {
      const { data, errors } = await client.query<
        CheckBoomPromoQuery,
        CheckBoomPromoQueryVariables
      >({
        query: CheckBoomPromoDocument,
        variables: { code },
        fetchPolicy: 'network-only',
      });
      promo = data ? data.checkBoomPromo ?? null : null;
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

  const onNext = async () => {
    setLoading(true);
    setError(null);
    const { error: err, promo } = await checkPromoCode();
    if (promo) {
      reset();
      next(promo);
    } else {
      setLoading(false);
      setError(err);
    }
  };

  const onPrev = () => {
    reset();
    prev();
  };

  const onChange = (value: string) => {
    setError(null);
    setLoading(false);
    setCode(value);
  };

  return (
    <EnterCodeView
      {...stepContentProps}
      value={code}
      onChange={onChange as any}
      error={error}
      loading={loading}
      next={onNext}
      prev={onPrev}
    />
  );
};

export default EnterCodeStep;
