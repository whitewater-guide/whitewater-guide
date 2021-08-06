import {
  ListedSectionFragment,
  RegionDetailsFragment,
} from '@whitewater-guide/clients';
import {
  BannerPlacement,
  BannerWithSourceFragment,
  Node,
} from '@whitewater-guide/schema';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataProvider } from 'recyclerlistview';

import { getBannersForPlacement } from '../../../features/banners';
import { ROWS_PER_SCREEN } from './item';

export default function useDataProvider(
  sections: ListedSectionFragment[],
  region?: RegionDetailsFragment | null,
) {
  const data: Array<ListedSectionFragment | BannerWithSourceFragment> =
    useMemo(() => {
      if (!region) {
        return sections;
      }
      const { banners: bannerNodes } = region;
      if (!bannerNodes) {
        return sections;
      }
      const { nodes } = bannerNodes;
      const numSections = sections.length;
      const numBanners = numSections >= 2 * ROWS_PER_SCREEN + 1 ? 2 : 1;
      const banners = getBannersForPlacement(
        nodes ?? [],
        BannerPlacement.MobileSectionRow,
        numBanners,
      );
      const result: Array<ListedSectionFragment | BannerWithSourceFragment> = [
        ...sections,
      ];
      for (let i = 1; i <= banners.length; i += 1) {
        result.splice(i * ROWS_PER_SCREEN + 2, 0, banners[i - 1]);
      }
      return result;
    }, [sections, region]);
  const dataRef = useRef(data);
  dataRef.current = data;

  const [provider, setProvider] = useState<DataProvider>(
    new DataProvider(
      (r1?: Node, r2?: Node) => {
        const id1 = r1?.id;
        const id2 = r2?.id;
        return !id1 || !id2 || id1 !== id2;
      },
      (index) => dataRef.current[index]?.id,
    ),
  );

  useEffect(() => {
    setProvider((prevProvider) => prevProvider.cloneWithRows(data));
  }, [data]);

  return provider;
}
