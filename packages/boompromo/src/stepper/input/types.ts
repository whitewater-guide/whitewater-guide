import { BoomPromoInfo } from '../../ww-commons';

export interface IInputStepStore {
  code: string;
  loading: boolean;
  error: string | null;
  ready: boolean;
  setCode: (e: any) => void;
  checkBoomPromo: () => Promise<BoomPromoInfo | null>;
  reset: () => void;
}
