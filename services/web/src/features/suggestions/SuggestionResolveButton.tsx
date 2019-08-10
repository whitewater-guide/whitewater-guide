import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';

interface Props {
  suggestionId: string;
  onClick: (id: string) => void;
}

const SuggestionResolveButton: React.FC<Props> = React.memo((props) => {
  const { suggestionId, onClick } = props;
  const onPress = useCallback(() => onClick(suggestionId), [
    suggestionId,
    onClick,
  ]);
  return (
    <Button color="primary" onClick={onPress}>
      Resolve
    </Button>
  );
});

SuggestionResolveButton.displayName = 'SuggestionResolveButton';

export default SuggestionResolveButton;
