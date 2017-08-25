import * as URL from 'url';

export default function getOrigin(url: string) {
  if (!url || url.startsWith('/')) {
    return '';
  }
  const { protocol, host } = URL.parse(url);
  return `${protocol}//${host}`;
}
