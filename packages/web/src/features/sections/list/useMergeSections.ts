import { useMergeSectionsMutation } from './mergeSections.generated';

export default function useMergeSections() {
  const [mutate, { loading }] = useMergeSectionsMutation({
    refetchQueries: ['listSections'],
  });
  return {
    mergeSections: (sourceId: string, destinationId: string) =>
      mutate({ variables: { sourceId, destinationId } }),
    loading,
  };
}
