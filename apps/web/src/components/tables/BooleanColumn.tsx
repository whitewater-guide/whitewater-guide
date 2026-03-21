import React from 'react';
import type { ColumnProps } from 'react-virtualized';

interface BooleanColumnProps extends ColumnProps {
  adminOnly?: boolean;
  iconTrue?: string;
  iconFalse?: string;
}

// eslint-disable-next-line react/prefer-stateless-function
export class BooleanColumn extends React.Component<BooleanColumnProps> {}
