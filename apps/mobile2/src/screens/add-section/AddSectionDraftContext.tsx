import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import type { AddSectionRegion, SectionFormInput } from './types';

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
  region: AddSectionRegion | null;
  setRegion: (region: AddSectionRegion | null) => void;
  submitApi: SubmitApi | null;
  setSubmitApi: (api: SubmitApi | null) => void;
}

const AddSectionDraftContext = createContext<AddSectionDraftContextValue>({
  draft: {},
  setDraft: () => {},
  resetDraft: () => {},
  region: null,
  setRegion: () => {},
  submitApi: null,
  setSubmitApi: () => {},
});

export function AddSectionDraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraftState] = useState<Partial<SectionFormInput>>({});
  const [region, setRegion] = useState<AddSectionRegion | null>(null);
  const [submitApi, setSubmitApi] = useState<SubmitApi | null>(null);

  const setDraft = useCallback(
    (updater: (prev: Partial<SectionFormInput>) => Partial<SectionFormInput>) => {
      setDraftState(updater);
    },
    [],
  );

  const resetDraft = useCallback(() => {
    setDraftState({});
    setRegion(null);
  }, []);

  const value = useMemo<AddSectionDraftContextValue>(
    () => ({
      draft,
      setDraft,
      resetDraft,
      region,
      setRegion,
      submitApi,
      setSubmitApi,
    }),
    [draft, setDraft, resetDraft, region, submitApi],
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

export function useAddSectionRegion(): AddSectionRegion | null {
  return useContext(AddSectionDraftContext).region;
}
