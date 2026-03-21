export interface SocialUser {
  id: string;
  email: string | null;
  username: string; // user name as in social account
  displayName: string; // user name as displayed in our app
  profile?: Record<string, any>; // social profile
}
