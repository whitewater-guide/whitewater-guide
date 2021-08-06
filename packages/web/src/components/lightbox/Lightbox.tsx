import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

import LightboxFooter from './LightboxFooter';
import LightboxView from './LightboxView';
import { LightboxItem } from './types';

const customStyles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blanket: (base: any) => ({
    ...base,
    zIndex: 1600,
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  positioner: (base: any) => ({
    ...base,
    zIndex: 1700,
  }),
};

interface Props {
  items: LightboxItem[];
  currentModal: number | null;
  onClose: () => void;
}

export const Lightbox = React.memo<Props>((props) => {
  const { currentModal, items, onClose } = props;
  return (
    <ModalGateway>
      {currentModal !== null && (
        <Modal
          allowFullscreen={false}
          onClose={onClose}
          styles={customStyles}
          className="foo"
        >
          <Carousel
            currentIndex={currentModal}
            components={{ View: LightboxView, Footer: LightboxFooter }}
            frameProps={{ autoSize: 'height' }}
            views={items}
          />
        </Modal>
      )}
    </ModalGateway>
  );
});

Lightbox.displayName = 'Lightbox';
