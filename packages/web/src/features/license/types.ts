import { License } from '@whitewater-guide/commons';

export interface LicenseInputOption {
  inputValue: string;
  title: string;
}

export type LicenseAutocompleteOption = License | LicenseInputOption;
