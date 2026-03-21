import React from 'react';
import { Keyboard } from 'react-native';
import { Appbar } from 'react-native-paper';

interface HeaderCenterProps {
  title?: React.ReactNode;
}

const HeaderCenter: React.FC<HeaderCenterProps> = React.memo(({ title }) => {
  return (
    <Appbar.Content
      title={typeof title === 'string' ? title : (title ?? '')}
      onPress={Keyboard.dismiss}
    />
  );
});

HeaderCenter.displayName = 'HeaderCenter';

export default HeaderCenter;
