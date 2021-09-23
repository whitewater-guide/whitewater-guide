import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
  useRegionQuery,
  useSectionQuery,
} from '@whitewater-guide/clients';
import React, { FC } from 'react';

import ErrorBoundary from '~/components/ErrorBoundary';
import { SelectedPOIView } from '~/components/map';
import WithQueryError from '~/components/WithQueryError';
import { PHOTO_SIZE_PX } from '~/features/media';
import { SectionScreenNavProps } from '~/screens/section/types';
import theme from '~/theme';

import SectionTabs from './SectionTabs';

const SectionScreenContent: FC<SectionScreenNavProps> = (props) => {
  const { data, error, loading, refetch } = useRegionQuery();
  return (
    <WithQueryError
      hasData={!!data?.region}
      error={error}
      loading={loading}
      refetch={refetch}
    >
      <MapSelectionProvider>
        <SectionTabs {...props} />
        <SelectedPOIView />
      </MapSelectionProvider>
    </WithQueryError>
  );
};

const SectionScreenInternal: FC<SectionScreenNavProps> = (props) => {
  const { data, error, loading, refetch } = useSectionQuery();
  const regionId = data?.section?.region?.id;
  return (
    <WithQueryError
      hasData={!!regionId}
      error={error}
      loading={loading}
      refetch={refetch}
    >
      {!!regionId && (
        <RegionProvider
          regionId={regionId}
          bannerWidth={theme.screenWidthPx}
          fetchPolicy="cache-first"
        >
          <SectionScreenContent {...props} />
        </RegionProvider>
      )}
    </WithQueryError>
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
