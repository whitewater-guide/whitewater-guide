import * as React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { REGION_NAME } from '../../ww-clients/features/regions';

interface Props {
  params: {
    regionId: string;
  };
}

interface Result {
  region: {
    name: string;
  };
}

type InnerProps = ChildProps<Props, Result>;

const RegionBreadcrumb: React.StatelessComponent<InnerProps> = ({ data }) => {
  return (
    <span>
      {data && data.region && data.region.name}
    </span>
  );
};

export default graphql<Result, Props>(
  REGION_NAME,
  {
    options: (props) => ({
      fetchPolicy: 'cache-only',
      variables: { id: props.params.regionId },
    }),
  },
)(RegionBreadcrumb);
