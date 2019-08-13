import Icon from '@material-ui/core/Icon';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SuggestionStatus } from '@whitewater-guide/commons';
import React from 'react';
import { Link } from 'react-router-dom';
import { ListedSuggestedSection } from './suggestedSections.query';

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
);

interface Props {
  suggestedSection: ListedSuggestedSection;
}

const SuggestedSectionStatusView: React.FC<Props> = React.memo((props) => {
  const { suggestedSection } = props;
  const { id, status, region } = suggestedSection;
  const classes = useStyles();
  if (status === SuggestionStatus.PENDING) {
    return (
      <Link to={`/regions/${region.id}/sections/new?fromSuggestedId=${id}`}>
        Resolve
      </Link>
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

SuggestedSectionStatusView.displayName = 'SuggestedSectionStatusView';

export default SuggestedSectionStatusView;
