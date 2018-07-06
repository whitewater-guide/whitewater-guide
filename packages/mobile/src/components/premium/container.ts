import { ApolloClient } from 'apollo-client';
import { withApollo } from 'react-apollo';
import { branch, compose } from 'recompose';
import { consumeRegion } from '../../ww-clients/features/regions';
import { withMe } from '../../ww-clients/features/users';
import { Region, User } from '../../ww-commons';

export interface OuterProps {
  region?: Region;
  sectionId?: string;
  cancelable?: boolean;
  onCancel?: () => void;
}

export interface InnerProps {
  region: Region; // required here
  sectionId?: string;
  cancelable?: boolean;
  onCancel?: () => void;
  me: User | null;
  client: ApolloClient<any>;
}

const container = compose<InnerProps, OuterProps>(
  branch(
    (props: OuterProps) => !props.region,
    consumeRegion(),
  ),
  withMe,
  withApollo,
);

export default container;
