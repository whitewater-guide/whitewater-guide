export type FBSDK = typeof FB;

export interface FacebookProfile {
  id: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

export interface FacebookContext {
  me?: FacebookProfile;
  accessToken?: string;
  loading: boolean;
  login: () => void;
  logout: () => void;
}
