import { getApolloClient } from '../../../../core/apollo';
import { RegionMediaSummary } from '../../../../ww-commons/features/regions';
import { REGION_MEDIA_SUMMARY, Result, Vars } from '../../regionMediaSummary.query';

interface Summary {
  photosCount: number;
  sectionsCount: number;
}

export default async function readCachedRegionSummary(regionId: string): Promise<Summary> {
  const client = await getApolloClient();
  const mediaQueryResult = client.readQuery<Result, Vars>({
    query: REGION_MEDIA_SUMMARY,
    variables: { regionId },
  });
  const summary: RegionMediaSummary = mediaQueryResult!.region!.mediaSummary!;
  return {
    photosCount: summary.photo.count,
    sectionsCount: mediaQueryResult!.region!.sections!.count!,
  };
}
