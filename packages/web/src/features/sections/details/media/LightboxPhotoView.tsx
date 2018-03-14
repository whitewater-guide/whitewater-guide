import * as React from 'react';
import { carouselComponents } from 'react-images/lib/components/defaultComponents';
import { Media } from '../../../../ww-commons';

const View = carouselComponents.View;

interface Props {
  currentIndex: number;
  data: Media;
  interactionIsIdle: boolean;
}

const LightboxPhotoView: React.StatelessComponent<Props> = (props) => {
  const newData = { ...props.data, source: props.data.url };
  return (
    <View {...props} data={newData} />
  );
};

export default LightboxPhotoView;
