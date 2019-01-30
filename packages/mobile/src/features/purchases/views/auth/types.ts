import { User } from '@whitewater-guide/commons';

export interface OuterProps {
  cancelable?: boolean;
}

export interface InnerProps {
  onContinue?: () => void;
  onCancel?: () => void;
  me: Pick<User, 'name' | 'avatar'> | null;
}
