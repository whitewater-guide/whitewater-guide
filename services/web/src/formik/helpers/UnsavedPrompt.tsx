import { useFormikContext } from 'formik';
import { Location } from 'history';
import isEmpty from 'lodash/isEmpty';
import React, { useCallback } from 'react';
import Prompt from 'react-router-navigation-prompt';
import { ConfirmationDialog } from '../../components';

export const UnsavedPrompt: React.FC = () => {
  const { touched, status } = useFormikContext();
  const shouldBlockNavigation = useCallback(
    (current: Location, next?: Location) => {
      return (
        !(status && status.success) &&
        !isEmpty(touched) &&
        !!next &&
        (next.pathname !== current.pathname || next.search !== current.search)
      );
    },
    [touched, status],
  );
  return (
    <Prompt when={shouldBlockNavigation}>
      {({ onConfirm, onCancel }) => (
        <ConfirmationDialog
          invertedAccents={true}
          description="There are some unsaved changes, are sure you don't want to save them?"
          confirmTitle="Leave"
          cancelTitle="Stay"
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )}
    </Prompt>
  );
};
