import { i18n } from '../i18n';

interface SnackbarMessage {
  text: string;
}

let handler: ((msg: SnackbarMessage) => void) | null = null;

export function registerSnackbarHandler(fn: (msg: SnackbarMessage) => void) {
  handler = fn;
  return () => {
    handler = null;
  };
}

export function showSnackbar(text: string) {
  handler?.({ text });
}

export function showSnackbarError(error?: Error | string | null) {
  if (!error) {
    return;
  }
  const text = typeof error === 'string' ? error : i18n.t('errors:default');
  handler?.({ text });
}
