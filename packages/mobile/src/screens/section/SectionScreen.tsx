import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
} from '@whitewater-guide/clients';
import React from 'react';

import ErrorBoundary from '~/components/ErrorBoundary';
import { SelectedPOIView } from '~/components/map';
import WithNetworkError from '~/components/WithNetworkError';
import { PHOTO_SIZE_PX } from '~/features/media';
import { SectionScreenNavProps } from '~/screens/section/types';
import theme from '~/theme';

import SectionTabs from './SectionTabs';

const SectionScreen: React.FC<SectionScreenNavProps> = (props) => {
  const { sectionId } = props.route.params;
  return (
    <ErrorBoundary>
      <SectionProvider sectionId={sectionId} thumbSize={PHOTO_SIZE_PX}>
        {({ data, error, loading, refetch }) => (
          <WithNetworkError
            hasData={!!data}
            hasError={!!error}
            loading={loading}
            refetch={refetch}
          >
            {data?.section && (
              <RegionProvider
                regionId={data.section.region.id}
                bannerWidth={theme.screenWidthPx}
                fetchPolicy="cache-first"
              >
                {(r) => (
                  <WithNetworkError
                    hasData={!!r.data?.region}
                    hasError={!!r.error}
                    loading={r.loading}
                    refetch={r.refetch}
                  >
                    <MapSelectionProvider>
                      <SectionTabs {...props} />
                      <SelectedPOIView />
                    </MapSelectionProvider>
                  </WithNetworkError>
                )}
              </RegionProvider>
            )}
          </WithNetworkError>
        )}
      </SectionProvider>
    </ErrorBoundary>
  );
};

export default SectionScreen;
