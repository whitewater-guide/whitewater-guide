import type { FC, PropsWithChildren } from 'react';
import React, { memo } from 'react';

const blockEvent = (event: React.SyntheticEvent) => event.stopPropagation();

export const ClickBlocker: FC<PropsWithChildren> = memo((props) => (
  <div {...props} onClick={blockEvent} />
));

ClickBlocker.displayName = 'ClickBlocker';
