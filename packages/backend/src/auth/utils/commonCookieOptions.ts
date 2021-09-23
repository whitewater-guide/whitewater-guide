import Cookies from 'cookies';

import config from '~/config';

export const commonCookieOptions: Cookies.SetOption = {
  httpOnly: true,
  secure: config.NODE_ENV === 'production',
  signed: false,
  sameSite: config.NODE_ENV === 'production' ? 'none' : 'strict',
};
