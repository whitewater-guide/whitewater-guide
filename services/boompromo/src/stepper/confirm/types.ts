export interface IConfirmStepStore {
  loading: boolean;
  error: string | null;
  success: boolean | null;
  activatePromo: (code: string, sku: string) => Promise<void>;
  reset: () => void;
}
