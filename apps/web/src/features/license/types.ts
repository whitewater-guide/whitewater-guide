import type { License } from '@whitewater-guide/schema';

export interface LicenseInputOption {
  inputValue: string;
  title: string;
}

export type LicenseAutocompleteOption = License | LicenseInputOption;
