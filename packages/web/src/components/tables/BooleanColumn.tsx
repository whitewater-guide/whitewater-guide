import React from 'react';
import { ColumnProps } from 'react-virtualized';

interface BooleanColumnProps extends ColumnProps {
  adminOnly?: boolean;
  iconTrue?: string;
  iconFalse?: string;
}

export class BooleanColumn extends React.Component<BooleanColumnProps> {}
