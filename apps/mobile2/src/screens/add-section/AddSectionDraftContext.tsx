import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { SectionFormInput } from './types';

interface SubmitApi {
  submit: () => void;
  isValid: boolean;
  isSubmitting: boolean;
}

interface AddSectionDraftContextValue {
  draft: Partial<SectionFormInput>;
  setDraft: (
    updater: (prev: Partial<SectionFormInput>) => Partial<SectionFormInput>,
  ) => void;
  resetDraft: () => void;
  submitApi: SubmitApi | null;
  setSubmitApi: (api: SubmitApi | null) => void;
}

const AddSectionDraftContext = createContext<AddSectionDraftContextValue>({
  draft: {},
  setDraft: () => {},
  resetDraft: () => {},
  submitApi: null,
  setSubmitApi: () => {},
});

export function AddSectionDraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraftState] = useState<Partial<SectionFormInput>>({});
  const [submitApi, setSubmitApi] = useState<SubmitApi | null>(null);

  const setDraft = useCallback(
    (
      updater: (prev: Partial<SectionFormInput>) => Partial<SectionFormInput>,
    ) => {
      setDraftState(updater);
    },
    [],
  );

  const resetDraft = useCallback(() => {
    setDraftState({});
  }, []);

  const value = useMemo<AddSectionDraftContextValue>(
    () => ({
      draft,
      setDraft,
      resetDraft,
      submitApi,
      setSubmitApi,
    }),
    [draft, setDraft, resetDraft, submitApi],
  );

  return (
    <AddSectionDraftContext.Provider value={value}>
      {children}
    </AddSectionDraftContext.Provider>
  );
}

export function useAddSectionDraft(): AddSectionDraftContextValue {
  return useContext(AddSectionDraftContext);
}
