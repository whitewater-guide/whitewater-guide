import * as React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { Media } from '../../../../ww-commons';
import LightboxFooter from './LightboxFooter';
import LightboxView from './LightboxView';

const customStyles  = {
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
  media: Media[];
  currentModal: number | null;
  onClose: () => void;
}

class Lightbox extends React.PureComponent<Props> {

  render() {
    const { currentModal, media, onClose } = this.props;
    return (
      <ModalGateway>
        {
          currentModal !== null &&
          <Modal allowFullscreen={false} onClose={onClose} styles={customStyles}>
            <Carousel
              currentIndex={currentModal}
              components={{ View: LightboxView, Footer: LightboxFooter }}
              frameProps={{ autoSize: 'height' }}
              views={media}
            />
          </Modal>
        }
      </ModalGateway>
    );
  }
}

export default Lightbox;
