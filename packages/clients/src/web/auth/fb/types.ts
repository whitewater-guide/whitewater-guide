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
