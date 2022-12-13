import React, { FC, memo, PropsWithChildren } from 'react';

const blockEvent = (event: React.SyntheticEvent) => event.stopPropagation();

export const ClickBlocker: FC<PropsWithChildren> = memo((props) => (
  <div {...props} onClick={blockEvent} />
));

ClickBlocker.displayName = 'ClickBlocker';
