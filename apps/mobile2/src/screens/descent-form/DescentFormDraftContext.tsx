import { useApolloClient } from '@apollo/client';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

import type { DescentFormFragment } from './getDescent.generated';
import { GetDescentDocument } from './getDescent.generated';
import type { DescentFormData } from './types';

interface DescentFormDraftContextValue {
  draft: Partial<DescentFormData>;
  setDraft: (
    updater: (prev: Partial<DescentFormData>) => Partial<DescentFormData>,
  ) => void;
  resetDraft: () => void;
  prefillFromDescent: (descentId: string) => Promise<void>;
  prefillLoading: boolean;
}

const DescentFormDraftContext = createContext<DescentFormDraftContextValue>({
  draft: {},
  setDraft: () => {},
  resetDraft: () => {},
  prefillFromDescent: async () => {},
  prefillLoading: false,
});

function fragmentToDraft(
  descent: DescentFormFragment,
): Partial<DescentFormData> {
  const { level, ...rest } = descent;
  return {
    ...rest,
    level:
      level?.value != null
        ? { value: level.value, unit: level.unit ?? undefined }
        : undefined,
  };
}

export function DescentFormDraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraftState] = useState<Partial<DescentFormData>>({});
  const [prefillLoading, setPrefillLoading] = useState(false);
  const apollo = useApolloClient();
  const prefillIdRef = useRef<string | null>(null);

  const setDraft = useCallback(
    (updater: (prev: Partial<DescentFormData>) => Partial<DescentFormData>) => {
      setDraftState(updater);
    },
    [],
  );

  const resetDraft = useCallback(() => {
    setDraftState({});
    prefillIdRef.current = null;
  }, []);

  const prefillFromDescent = useCallback(
    async (descentId: string) => {
      if (prefillIdRef.current === descentId) {
        return;
      }
      prefillIdRef.current = descentId;
      setPrefillLoading(true);
      try {
        const result = await apollo.query<
          import('./getDescent.generated').GetDescentQuery,
          import('./getDescent.generated').GetDescentQueryVariables
        >({
          query: GetDescentDocument,
          fetchPolicy: 'network-only',
          variables: { descentId },
        });
        const descent = result.data?.descent;
        if (descent) {
          setDraftState(fragmentToDraft(descent));
        }
      } catch {
        /* ignore — user can still fill manually */
      } finally {
        setPrefillLoading(false);
      }
    },
    [apollo],
  );

  return (
    <DescentFormDraftContext.Provider
      value={{ draft, setDraft, resetDraft, prefillFromDescent, prefillLoading }}
    >
      {children}
    </DescentFormDraftContext.Provider>
  );
}

export function useDescentFormDraft(): DescentFormDraftContextValue {
  return useContext(DescentFormDraftContext);
}
