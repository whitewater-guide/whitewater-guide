import type React from 'react';

export type SearchContexts = [
  React.Context<string>,
  React.Context<(v: string) => void>,
];
