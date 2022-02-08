import { SafeSectionDetails } from '@whitewater-guide/clients';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import Markdown from '~/components/Markdown';
import copyAndToast from '~/utils/copyAndToast';

import Placeholder from './placeholder';

interface Props {
  section?: SafeSectionDetails | null;
}

// Priorities:
// section description is empty string when there is no description (even for premium)
// section description is null when premium is required
const SectionInfoDescription: React.FC<Props> = ({ section }) => {
  if (!section) {
    return null;
  }

  if (section.description) {
    return (
      <TouchableWithoutFeedback
        onLongPress={() => copyAndToast(section.description!)}
      >
        <Markdown>{section.description}</Markdown>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <Placeholder section={section} premium={section.description === null} />
  );
};

export default SectionInfoDescription;
