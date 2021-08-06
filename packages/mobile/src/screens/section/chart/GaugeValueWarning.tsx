import React from 'react';
import { StyleSheet } from 'react-native';
import { Popover, PopoverController } from 'react-native-modal-popover';

import Icon from '~/components/Icon';

import theme from '../../../theme';

const styles = StyleSheet.create({
  popoverContent: {
    padding: 8,
    backgroundColor: theme.colors.primaryBackground,
  },
});

const GaugeWarning: React.FC = ({ children }) => (
  <PopoverController>
    {({
      openPopover,
      closePopover,
      popoverVisible,
      setPopoverAnchor,
      popoverAnchorRect,
    }) => (
      <>
        <Icon
          icon="alert"
          size={16}
          ref={setPopoverAnchor}
          onPress={openPopover}
        />
        <Popover
          useNativeDriver
          contentStyle={styles.popoverContent}
          visible={popoverVisible}
          onClose={closePopover}
          fromRect={popoverAnchorRect}
        >
          {children}
        </Popover>
      </>
    )}
  </PopoverController>
);

export default GaugeWarning;
