import { baseResolver } from '../../../apollo';

const me = baseResolver.createResolver(
  (root, args, context) => context.user,
);

export default me;
