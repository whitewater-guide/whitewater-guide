import { InputProps as StandardInputProps } from '@material-ui/core/Input';
import { InputLabelProps } from '@material-ui/core/InputLabel';
import { NamedNode } from '@whitewater-guide/commons';

export interface AutocompleteFilterOptions<T extends NamedNode = NamedNode> {
  limit?: number;
  matchInput?: true | ((input: string | null, option: T) => boolean);
}

export interface AutocompleteMenuProps {
  disablePortal?: boolean;
  matchInputWidth?: boolean;
  className?: string;
}

export interface AutocompleteProps<T extends NamedNode = NamedNode> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;

  inputValue?: string;
  onInputValueChange?: (value: string) => void;

  className?: string;
  label?: string;
  placeholder?: string;
  allowNull?: boolean;
  filterOptions?: AutocompleteFilterOptions;
  menuProps?: AutocompleteMenuProps;
}

export interface MulticompleteProps<T extends NamedNode = NamedNode> {
  options: T[];
  values: T[];
  onAdd: (value: NamedNode) => void;
  onDelete: (id: string) => void;
  openOnFocus?: boolean;

  label?: string;
  placeholder?: string;
  filterOptions?: AutocompleteFilterOptions;
  menuProps?: AutocompleteMenuProps;
  InputProps?: Partial<StandardInputProps>;
  InputLabelProps?: Partial<InputLabelProps>;
}
