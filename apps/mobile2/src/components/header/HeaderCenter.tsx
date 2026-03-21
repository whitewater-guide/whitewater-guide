import type { ReactNode } from 'react';
import { memo } from 'react';
import { Keyboard } from 'react-native';
import { Appbar } from 'react-native-paper';

interface HeaderCenterProps {
  title?: ReactNode;
}

const HeaderCenter = memo(({ title }: HeaderCenterProps) => {
  return (
    <Appbar.Content
      title={typeof title === 'string' ? title : (title ?? '')}
      onPress={Keyboard.dismiss}
    />
  );
});

export default HeaderCenter;
