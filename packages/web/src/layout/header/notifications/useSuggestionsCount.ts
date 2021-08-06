import { useSuggestionsCountQuery } from './suggestionsCount.generated';

export default (): number | null => {
  const { data } = useSuggestionsCountQuery({
    fetchPolicy: 'cache-and-network',
  });
  if (data?.suggestions && data.sections) {
    return data.suggestions.count + data.sections.count;
  }
  return null;
};
