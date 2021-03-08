import {
  Banner,
  BannerPlacement,
  Node,
  Region,
  Section,
} from '@whitewater-guide/commons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataProvider } from 'recyclerlistview';

import { getBannersForPlacement } from '../../../features/banners';
import { ROWS_PER_SCREEN } from './item';

export default (sections: Section[], region: Region | null) => {
  const data: Array<Section | Banner> = useMemo(() => {
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
      BannerPlacement.MOBILE_SECTION_ROW,
      numBanners,
    );
    const result: Array<Section | Banner> = [...sections];
    for (let i = 1; i <= banners.length; i++) {
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
};
