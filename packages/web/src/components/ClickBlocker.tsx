import React from 'react';

const blockEvent = (event: React.SyntheticEvent) => event.stopPropagation();

export const ClickBlocker: React.FC = React.memo((props) => (
  <div {...props} onClick={blockEvent} />
));

ClickBlocker.displayName = 'ClickBlocker';
