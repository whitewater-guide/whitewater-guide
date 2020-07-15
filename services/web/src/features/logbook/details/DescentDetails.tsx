import React from 'react';
import { RouterParams } from './types';

interface Props {
  match: {
    params: RouterParams;
  };
}

const DescentDetails: React.FC<Props> = ({ match }) => {
  return <div>{`Descent details ${match.params.descentId}`}</div>;
};

export default DescentDetails;
