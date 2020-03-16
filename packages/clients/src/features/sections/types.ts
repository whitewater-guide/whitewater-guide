export type FlowFormula = (x: number | null) => number | null;

export interface Formulas {
  levels: FlowFormula;
  flows: FlowFormula;
}

export enum SectionsStatus {
  LOADING,
  LOADING_UPDATES,
  READY,
}
