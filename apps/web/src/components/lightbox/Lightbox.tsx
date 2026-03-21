import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Carousel from 'nuka-carousel';
import React from 'react';

import LightboxBottomLeft from './LightboxBottomLeft';
import LightboxBottomRight from './LightboxBottomRight';
import LightboxView from './LightboxView';
import type { LightboxItem } from './types';

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      height: '100vh',
    },
    slide: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    close: {
      color: 'white',
    },
  }),
);

interface Props {
  items: LightboxItem[];
  currentModal: number | null;
  onClose: () => void;
}

export const Lightbox = React.memo<Props>((props) => {
  const { currentModal, items, onClose } = props;
  const classes = useStyles();
  // eslint-disable-next-line no-eq-null, eqeqeq
  if (currentModal == null) {
    return null;
  }
  return (
    <Modal open className={classes.modal}>
      <Carousel
        wrapAround
        slideIndex={currentModal}
        defaultControlsConfig={{
          nextButtonText: <ChevronRightIcon />,
          prevButtonText: <ChevronLeftIcon />,
        }}
        renderBottomLeftControls={(props) => (
          <LightboxBottomLeft items={items} {...props} />
        )}
        renderTopRightControls={() => (
          <IconButton size="medium" onClick={onClose}>
            <Icon className={classes.close}>close</Icon>
          </IconButton>
        )}
        renderBottomRightControls={LightboxBottomRight}
      >
        {items.map((i) => (
          <div key={i.id} className={classes.slide}>
            <LightboxView data={i} />
          </div>
        ))}
      </Carousel>
    </Modal>
  );
});

Lightbox.displayName = 'Lightbox';
