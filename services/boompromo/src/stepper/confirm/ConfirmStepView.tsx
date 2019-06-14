import StepContent from '@material-ui/core/StepContent';
import React from 'react';
import PromptView, { PromptViewProps } from './PromptView';
import SuccessView, { SuccessViewProps } from './SuccessView';

type Props = SuccessViewProps &
  PromptViewProps & {
    success?: boolean;
  };

const ConfirmStepView: React.FC<Props> = (props) => {
  const {
    success,
    region,
    promo,
    username,
    loading,
    error,
    onNext,
    onPrev,
    ...stepContentProps
  } = props;
  return (
    <StepContent {...stepContentProps}>
      {success ? (
        <SuccessView region={region} promo={promo} />
      ) : (
        <PromptView
          region={region}
          promo={promo}
          username={username}
          loading={loading}
          error={error}
          onNext={onNext}
          onPrev={onPrev}
        />
      )}
    </StepContent>
  );
};

export default ConfirmStepView;
