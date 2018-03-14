import * as React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import { Media } from '../../../../ww-commons';
import LightboxView from './LightboxView';

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
          <Modal allowFullscreen={false} onClose={onClose}>
            <Carousel
              currentIndex={currentModal}
              components={{ View: LightboxView }}
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
