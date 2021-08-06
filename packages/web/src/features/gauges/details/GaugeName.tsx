import { GaugeCoreFragment } from '@whitewater-guide/schema';
import React from 'react';

interface Props {
  gauge: GaugeCoreFragment;
}

const GaugeName = React.memo<Props>(({ gauge }) => {
  const { name, url } = gauge;
  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {name}
      </a>
    );
  }
  return <span>name</span>;
});

GaugeName.displayName = 'GaugeName';

export default GaugeName;
