const emailRegExp =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export function isEmail(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  const parts = value.split('@');

  if (parts.length !== 2) {
    return false;
  }
  const [account, domain] = parts;

  if (account.length > 64 || domain.length > 255) {
    return false;
  }

  const domainParts = domain.split('.');
  if (domainParts.some((p) => p.length > 63)) {
    return false;
  }

  return emailRegExp.test(value);
}
