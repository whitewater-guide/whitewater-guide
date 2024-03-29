import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
  useSection,
} from '@whitewater-guide/clients';
import type { FC } from 'react';
import React from 'react';

import ErrorBoundary from '~/components/ErrorBoundary';
import { PHOTO_SIZE_PX } from '~/features/media';
import type { SectionScreenNavProps } from '~/screens/section/types';
import theme from '~/theme';

import SectionTabs from './SectionTabs';

const SectionScreenContent: FC<SectionScreenNavProps> = (props) => {
  return (
    <MapSelectionProvider>
      <SectionTabs {...props} />
    </MapSelectionProvider>
  );
};

const SectionScreenInternal: FC<SectionScreenNavProps> = (props) => {
  const section = useSection();
  const regionId = section?.region?.id;
  return (
    <RegionProvider
      regionId={regionId}
      bannerWidth={theme.screenWidthPx}
      fetchPolicy="cache-first"
    >
      <SectionScreenContent {...props} />
    </RegionProvider>
  );
};

const SectionScreen: FC<SectionScreenNavProps> = (props) => {
  const { sectionId } = props.route.params;
  return (
    <ErrorBoundary>
      <SectionProvider sectionId={sectionId} thumbSize={PHOTO_SIZE_PX}>
        <SectionScreenInternal {...props} />
      </SectionProvider>
    </ErrorBoundary>
  );
};

export default SectionScreen;
