import { SuggestionInput } from '@whitewater-guide/commons';

export default (sectionId: string): SuggestionInput => ({
  section: {
    id: sectionId,
  },
  resolution: null,
  filename: null,
  description: '',
  copyright: null,
});
