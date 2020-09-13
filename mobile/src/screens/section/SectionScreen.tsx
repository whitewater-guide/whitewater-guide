import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
} from '@whitewater-guide/clients';
import React from 'react';

import ErrorBoundary from '~/components/ErrorBoundary';
import { SelectedPOIView } from '~/components/map';
import WithNetworkError from '~/components/WithNetworkError';
import { SectionScreenNavProps } from '~/screens/section/types';
import theme from '~/theme';

import { SECTION_DETAILS } from './sectionDetails.query';
import SectionTabs from './SectionTabs';

const SectionScreen: React.FC<SectionScreenNavProps> = (props) => {
  const { sectionId } = props.route.params;
  return (
    <ErrorBoundary>
      <SectionProvider sectionId={sectionId} query={SECTION_DETAILS}>
        {(s) => (
          <WithNetworkError
            data={s.node}
            error={s.error}
            loading={s.loading}
            refetch={s.refetch}
          >
            {s.node && (
              <RegionProvider
                regionId={s.node!.region.id}
                bannerWidth={theme.screenWidthPx}
                fetchPolicy="cache-first"
              >
                {(r) => (
                  <WithNetworkError
                    data={r.node}
                    error={r.error}
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
