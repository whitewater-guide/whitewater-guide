import type { ListedMedia } from '../types';

export interface ThumbProps {
  index: number;
  media: ListedMedia;
  editable?: boolean;
  onEdit?: (media: ListedMedia) => void;
  onRemove?: (media: ListedMedia) => void;
  onClick?: (media: ListedMedia, index: number) => void;
}

export interface ThumbState {
  thumb?: string | null;
  width?: number;
  height?: number;
}
