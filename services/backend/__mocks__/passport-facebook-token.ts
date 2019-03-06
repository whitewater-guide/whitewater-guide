import { Profile } from 'passport-facebook';
import { ADMIN_FB_PROFILE } from '../src/seeds/test/01_users';

// @ts-ignore
const FacebookMobileStrategyActual = jest.requireActual(
  'passport-facebook-token',
);

const PROFILE_BY_TOKEN = new Map<string, Partial<Profile> | null>([
  ['__bad_access_token__', null],
  [
    '__new_access_token__',
    {
      id: '__mock_new_profile_id__',
      name: {
        familyName: 'New Profile Family Name',
        givenName: 'New Profile Given Name',
      },
      emails: [
        {
          value: 'new.profile@mail.com',
        },
      ],
      photos: [
        {
          value:
            'https://platform-lookaside.fbsbx.com/platform/profilepic/mock_new_profile',
        },
      ],
      provider: 'facebook',
      _raw:
        '{"last_name": "New Profile Family Name", "first_name": "New Profile Given Name", "email": "new.profile\u0040mail.com", "picture": {"data": {"height": 50, "is_silhouette": false, "url": "https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/mock_new_profile", "width": 50}}, "id": "__mock_new_profile_id__"}',
      _json: {
        last_name: 'New Profile Family Name',
        first_name: 'New Profile Given Name',
        email: 'new.profile@mail.com',
        picture: {
          data: {
            height: 50,
            is_silhouette: false,
            url:
              'https://platform-lookaside.fbsbx.com/platform/profilepic/mock_new_profile',
            width: 50,
          },
        },
        id: '__mock_new_profile_id__',
      },
    },
  ],
  ['__existing_access_token__', ADMIN_FB_PROFILE],
]);

export default class FacebookTokenStrategy extends FacebookMobileStrategyActual {
  userProfile(accessToken: string, done: any) {
    const profile = PROFILE_BY_TOKEN.get(accessToken);
    if (profile) {
      done(null, profile);
    } else {
      done(new Error('Failed to fetch user profile'));
    }
  }
}
