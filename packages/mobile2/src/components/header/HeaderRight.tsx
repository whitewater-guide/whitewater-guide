import React from 'react';

interface HeaderRightProps {
  element?: React.ReactNode;
}

const HeaderRight: React.FC<HeaderRightProps> = React.memo(({ element }) => {
  return element || null;
});

HeaderRight.displayName = 'HeaderRight';

export default HeaderRight;
