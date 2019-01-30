import { FacebookProfile } from '../../auth/fb';

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
