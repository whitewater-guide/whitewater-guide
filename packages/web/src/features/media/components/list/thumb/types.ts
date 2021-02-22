import { MediaOrInput } from '../types';

export interface ThumbProps {
  index: number;
  media: MediaOrInput;
  editable?: boolean;
  onEdit?: (media: MediaOrInput) => void;
  onRemove?: (media: MediaOrInput) => void;
  onClick?: (media: MediaOrInput, index: number) => void;
}

export interface ThumbState {
  thumb?: string | null;
  width?: number;
  height?: number;
}
