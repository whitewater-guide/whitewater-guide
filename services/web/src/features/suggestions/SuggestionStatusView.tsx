import Icon from '@material-ui/core/Icon';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SuggestionStatus } from '@whitewater-guide/commons';
import React from 'react';
import { ListedSuggestion } from './listSuggestions.query';
import SuggestionResolveButton from './SuggestionResolveButton';

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
);

interface Props {
  suggestion: ListedSuggestion;
  onPressResolve: (id: string) => void;
}

const SuggestionStatusView: React.FC<Props> = React.memo((props) => {
  const { suggestion, onPressResolve } = props;
  const { id, status } = suggestion;
  const classes = useStyles();
  if (status === SuggestionStatus.PENDING) {
    return (
      <SuggestionResolveButton suggestionId={id} onClick={onPressResolve} />
    );
  }
  return (
    <div className={classes.wrapper}>
      <Icon>{status === SuggestionStatus.ACCEPTED ? 'check' : 'close'}</Icon>
      <span>
        {status === SuggestionStatus.ACCEPTED ? 'accepted' : 'rejected'}
      </span>
    </div>
  );
});

SuggestionStatusView.displayName = 'SuggestionStatusView';

export default SuggestionStatusView;
