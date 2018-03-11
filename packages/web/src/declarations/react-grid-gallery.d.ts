declare module 'react-grid-gallery' {
  import * as React from 'react';

  export interface GalleryTag {
    value: string;
    title: string;
  }

  export interface GalleryImage {
    src: string;
    thumbnail: string;
    thumbnailWidth: number;
    thumbnailHeight: number;
    tags?: GalleryTag[];
    isSelected?: boolean;
    caption?: string;
    srcSet?: string[];
    customOverlay?: React.ReactElement<any>;
    thumbnailCaption?: string | React.ReactElement<any>;
    orientation?: number;
  }

  export interface GalleryProps {
    images:	GalleryImage[];
    id?:	string;
    enableImageSelection?:	boolean;
    onSelectImage?:	(this: Gallery, index?: number, image?: GalleryImage) => void;
    rowHeight?:	number;
    maxRows?:	number;
    margin?:	number;
    enableLightbox?:	boolean;
    onClickThumbnail?:	(this: Gallery, index?: number, event?: React.MouseEvent<any>) => void;
    lightboxWillOpen?:	(this: Gallery, index?: number) => void;
    lightboxWillClose?:	(this: Gallery, index?: number) => void;
    tagStyle?:	React.CSSProperties;
    tileViewportStyle?:	(this: GalleryImage) => React.CSSProperties;
    thumbnailStyle?:	(this: GalleryImage) => React.CSSProperties;
  }

  export interface LightboxProps {
    backdropClosesModal?: boolean;
    currentImage?: number;
    preloadNextImage?: boolean;
    customControls?: Array<React.ReactElement<any>>;
    enableKeyboardInput?: boolean;
    imageCountSeparator?: string;
    isOpen?: boolean;
    showCloseButton?: boolean;
    showImageCount?: boolean;
    onClickImage?: () => void;
    onClickPrev?: () => void;
    onClickNext?: () => void;
    showLightboxThumbnails?: boolean;
    onClickLightboxThumbnail?: () => void;
    lightboxWidth?: number;
  }

  class Gallery extends React.Component<GalleryProps & LightboxProps> {}

  export default Gallery;
}
