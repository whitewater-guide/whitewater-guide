import { extractSessionId } from './sessions';

describe('extractSessionId', () => {
  it('should get session id', () => {
    const resp: any = {
      header: {
        connection: 'close',
        'content-length': '5',
        'content-type': 'text/plain; charset=utf-8',
        date: 'Tue, 05 Mar 2019 12:18:16 GMT',
        location:
          'http://localhost:6001/auth/facebook/callback?__mock_strategy_callback=true',
        'set-cookie': [
          'wwguide.sig=WjDUotbe0rkUzkHIrh3Apydhs20; path=/; expires=Fri, 05 Apr 2019 12:18:16 GMT; httponly',
          'wwguide=1551788296122-jR7h4EyBJ6RzlNqTdQNrEvqn_rKcou5J; path=/; expires=Fri, 05 Apr 2019 12:18:16 GMT; httponly',
        ],
        vary: 'Origin',
      },
    };
    expect(extractSessionId(resp)).toBe(
      '1551788296122-jR7h4EyBJ6RzlNqTdQNrEvqn_rKcou5J',
    );
  });

  it('should get session id 2', () => {
    const resp: any = {
      header: {
        vary: 'Origin',
        location: '/',
        'content-type': 'text/html; charset=utf-8',
        'content-length': '33',
        'set-cookie': [
          'wwguide=1551794696048-qgB1uQ0Sg6kOx_bGP4eTUbiruQZNnh-o; path=/; expires=Fri, 05 Apr 2019 14:04:56 GMT; httponly',
          'wwguide.sig=FRMfX7mWwB9_UsV38Q4yjingj7Q; path=/; expires=Fri, 05 Apr 2019 14:04:56 GMT; httponly',
        ],
        date: 'Tue, 05 Mar 2019 14:04:56 GMT',
        connection: 'close',
      },
    };
    expect(extractSessionId(resp)).toBe(
      '1551794696048-qgB1uQ0Sg6kOx_bGP4eTUbiruQZNnh-o',
    );
  });

  it('should not get session id when no headers are present', () => {
    const resp: any = {};
    expect(extractSessionId(resp)).toBeUndefined();
  });
  it('should not get session id when no cookies are present', () => {
    const resp: any = {
      header: {
        connection: 'close',
        'content-length': '5',
        'content-type': 'text/plain; charset=utf-8',
        date: 'Tue, 05 Mar 2019 12:18:16 GMT',
        location:
          'http://localhost:6001/auth/facebook/callback?__mock_strategy_callback=true',
        vary: 'Origin',
      },
    };
    expect(extractSessionId(resp)).toBeUndefined();
  });

  it('should not get session id when no session cookies are present', () => {
    const resp: any = {
      header: {
        connection: 'close',
        'content-length': '5',
        'content-type': 'text/plain; charset=utf-8',
        date: 'Tue, 05 Mar 2019 12:18:16 GMT',
        location:
          'http://localhost:6001/auth/facebook/callback?__mock_strategy_callback=true',
        'set-cookie': [
          'someapp=1551788296122-jR7h4EyBJ6RzlNqTdQNrEvqn_rKcou5J; path=/; expires=Fri, 05 Apr 2019 12:18:16 GMT; httponly',
          'someapp.sig=WjDUotbe0rkUzkHIrh3Apydhs20; path=/; expires=Fri, 05 Apr 2019 12:18:16 GMT; httponly',
        ],
        vary: 'Origin',
      },
    };
    expect(extractSessionId(resp)).toBeUndefined();
  });
});
