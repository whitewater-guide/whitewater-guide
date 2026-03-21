declare module 'apple-signin-auth' {
  export interface AppleIdTokenType {
    /** The issuer-registered claim key, which has the value https://appleid.apple.com. */
    iss: string;
    /** The unique identifier for the user. */
    sub: string;
    /** Your client_id in your Apple Developer account. */
    aud: string;
    /** The expiry time for the token. This value is typically set to five minutes. */
    exp: string;
    /** The time the token was issued. */
    iat: string;
    /** A String value used to associate a client session and an ID token. This value is used to mitigate replay attacks and is present only if passed during the authorization request. */
    nonce: string;
    /** A Boolean value that indicates whether the transaction is on a nonce-supported platform. If you sent a nonce in the authorization request but do not see the nonce claim in the ID token, check this claim to determine how to proceed. If this claim returns true you should treat nonce as mandatory and fail the transaction; otherwise, you can proceed treating the nonce as optional. */
    nonce_supported: boolean;
    /** The user's email address. */
    email?: string;
    /** A Boolean value that indicates whether the service has verified the email. The value of this claim is always true because the servers only return verified email addresses. */
    email_verified: boolean;
  }

  export function verifyIdToken(
    idToken: string,
    options: any,
  ): Promise<AppleIdTokenType>;
}
