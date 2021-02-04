export interface SnackbarMessage {
  short: string;
  full?: string;
  error?: boolean;
}

export const isSnackbarMessage = (v: any): v is SnackbarMessage =>
  !!v && 'short' in v;