import type { ReactNode } from 'react';
import { memo } from 'react';

interface HeaderRightProps {
  element?: ReactNode;
}

const HeaderRight = memo(({ element }: HeaderRightProps) => {
  return element || null;
});

export default HeaderRight;
