import { Gauge } from '@whitewater-guide/commons';
import React from 'react';

interface Props {
  gauge: Gauge;
}

const GaugeName: React.FC<Props> = React.memo(({ gauge }) => {
  const { name, url } = gauge;
  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {name}
      </a>
    );
  } else {
    return <span>name</span>;
  }
});

GaugeName.displayName = 'GaugeName';

export default GaugeName;
