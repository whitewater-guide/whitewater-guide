export type Overwrite<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;
