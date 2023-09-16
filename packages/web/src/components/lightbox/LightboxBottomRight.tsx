import type { ControlProps } from 'nuka-carousel';
import type { FC } from 'react';
import React from 'react';

const LightboxBottomRight: FC<ControlProps> = ({
  currentSlide,
  slideCount,
}) => {
  if (slideCount <= 1) {
    return null;
  }
  return <span>{`${currentSlide + 1} / ${slideCount}`}</span>;
};

export default LightboxBottomRight;
