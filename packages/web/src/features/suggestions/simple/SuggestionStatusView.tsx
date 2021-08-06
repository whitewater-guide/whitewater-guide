import Icon from '@material-ui/core/Icon';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SuggestionStatus } from '@whitewater-guide/schema';
import React from 'react';

import { ListedSuggestionFragment } from './listSuggestions.generated';
import SuggestionResolveButton from './SuggestionResolveButton';

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
);

interface Props {
  suggestion: ListedSuggestionFragment;
  onPressResolve: (id: string) => void;
}

const SuggestionStatusView = React.memo<Props>((props) => {
  const { suggestion, onPressResolve } = props;
  const { id, status } = suggestion;
  const classes = useStyles();
  if (status === SuggestionStatus.Pending) {
    return (
      <SuggestionResolveButton suggestionId={id} onClick={onPressResolve} />
    );
  }
  return (
    <div className={classes.wrapper}>
      <Icon>{status === SuggestionStatus.Accepted ? 'check' : 'close'}</Icon>
      <span>
        {status === SuggestionStatus.Accepted ? 'accepted' : 'rejected'}
      </span>
    </div>
  );
});

SuggestionStatusView.displayName = 'SuggestionStatusView';

export default SuggestionStatusView;
