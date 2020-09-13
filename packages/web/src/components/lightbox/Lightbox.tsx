import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

import LightboxFooter from './LightboxFooter';
import LightboxView from './LightboxView';
import { LightboxItem } from './types';

const customStyles = {
  blanket: (base: any) => ({
    ...base,
    zIndex: 1600,
  }),
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

export const Lightbox: React.FC<Props> = React.memo((props) => {
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
