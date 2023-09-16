import type { SuggestionInput } from '@whitewater-guide/schema';

export default (sectionId: string): SuggestionInput => ({
  section: {
    id: sectionId,
  },
  resolution: null,
  filename: null,
  description: '',
  copyright: null,
});
