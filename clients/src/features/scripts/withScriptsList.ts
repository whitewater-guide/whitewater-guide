import { Script } from '../../../ww-commons';
import { enhancedQuery } from '../../apollo';
import LIST_SCRIPTS from './listScripts.query';

interface Result {
  scripts: Script[];
}

export interface ScriptsList {
  list: Script[];
  loading: boolean;
  refetch: () => void;
}

export interface WithScriptsList {
  scripts: ScriptsList;
}

export const withScriptsList = enhancedQuery<Result, any, WithScriptsList>(
  LIST_SCRIPTS,
  {
    options: {
      fetchPolicy: 'cache-and-network',
    },
    props: ({ data }) => {
      const { scripts, loading, refetch } = data!;
      return { scripts: { list: scripts || [], loading, refetch } };
    },
    alias: 'withScriptsList',
  },
);
