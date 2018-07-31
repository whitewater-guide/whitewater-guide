import { TopLevelResolver } from '@apollo';

const me: TopLevelResolver = (root, args, context) => context.user || null;

export default me;
