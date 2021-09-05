import * as Sentry from '@sentry/react-native';
import {
  MapSelectionProvider,
  RegionProvider,
  SectionDetailsQuery,
  SectionProvider,
} from '@whitewater-guide/clients';
import React, { useEffect } from 'react';

import ErrorBoundary from '~/components/ErrorBoundary';
import Loading from '~/components/Loading';
import { SelectedPOIView } from '~/components/map';
import WithNetworkError from '~/components/WithNetworkError';
import { PHOTO_SIZE_PX } from '~/features/media';
import { SectionScreenNavProps } from '~/screens/section/types';
import theme from '~/theme';

import SectionTabs from './SectionTabs';

interface SectionRegionProviderProps {
  loading: boolean;
  section: NonNullable<SectionDetailsQuery['section']>;
}

const SectionRegionProvider: React.FC<SectionRegionProviderProps> = ({
  loading,
  section,
  children,
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      type: 'debug',
      category: 'data',
      level: Sentry.Severity.Info,
      message: 'SectionRegionProvider debug info',
      data: { section: section.id, keys: Object.keys(section), loading },
    });
  }, [section, loading]);

  if (!section.region && loading) {
    return <Loading />;
  }

  return (
    <RegionProvider
      regionId={section.region.id}
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
          <MapSelectionProvider>{children}</MapSelectionProvider>
        </WithNetworkError>
      )}
    </RegionProvider>
  );
};

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
              <SectionRegionProvider section={data?.section} loading={loading}>
                <SectionTabs {...props} />
                <SelectedPOIView />
              </SectionRegionProvider>
            )}
          </WithNetworkError>
        )}
      </SectionProvider>
    </ErrorBoundary>
  );
};

export default SectionScreen;
