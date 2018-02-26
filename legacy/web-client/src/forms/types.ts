export interface FieldProps<T> {
  value: T;
  error?: string;
  onChange: (value: T) => void;
}

export interface ContextProps {
  formData: any;
  formErrors: { [field: string]: string };
  formFieldChangeHandler: (keys: {[field: string]: any}) => void;
}
