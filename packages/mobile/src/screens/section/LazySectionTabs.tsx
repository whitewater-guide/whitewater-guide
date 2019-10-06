import {
  MapSelectionProvider,
  RegionProvider,
  SectionProvider,
} from '@whitewater-guide/clients';
import ErrorBoundary from 'components/ErrorBoundary';
import { SelectedPOIView } from 'components/map';
import WithNetworkError from 'components/WithNetworkError';
import React from 'react';
import theme from '../../theme';
import { SECTION_DETAILS } from './sectionDetails.query';

interface Props {
  regionId: string;
  sectionId: string;
}

const LazySectionTabs: React.FC<Props> = React.memo(
  ({ regionId, sectionId, children }) => {
    if (!regionId || !sectionId) {
      return null;
    }
    return (
      <ErrorBoundary>
        <RegionProvider
          regionId={regionId}
          bannerWidth={theme.screenWidthPx}
          fetchPolicy="cache-only"
        >
          <SectionProvider sectionId={sectionId} query={SECTION_DETAILS}>
            {({ node, error, loading, refetch }) => (
              <WithNetworkError
                data={node}
                error={error}
                loading={loading}
                refetch={refetch}
              >
                <MapSelectionProvider>
                  {children}
                  <SelectedPOIView />
                </MapSelectionProvider>
              </WithNetworkError>
            )}
          </SectionProvider>
        </RegionProvider>
      </ErrorBoundary>
    );
  },
);

LazySectionTabs.displayName = 'LazySectionTabs';

export default LazySectionTabs;
