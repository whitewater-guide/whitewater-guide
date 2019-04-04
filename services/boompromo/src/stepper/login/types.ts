import { FacebookProfile } from '@whitewater-guide/clients/dist/web';

export interface ILoginStepStore {
  error: string | null;
  loading: boolean;
  facebookLoading: boolean;
  me: FacebookProfile | null;
  ready: boolean;
  init: () => void;
  fbLogin: () => void;
  fbLogout: () => void;
  login: () => Promise<any>;
}
