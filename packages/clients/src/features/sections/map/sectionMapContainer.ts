import noop from 'lodash/noop';
import { compose, StateHandlerMap, withProps, withStateHandlers } from 'recompose';
import { Point } from '../../../../ww-commons/features/points';
import { MapProps } from '../../maps';
import { SectionMapProps } from './types';

type TState = Pick<MapProps, 'selectedPOIId'>;

export const sectionMapContainer = compose<MapProps, SectionMapProps>(
  withStateHandlers<TState, StateHandlerMap<TState>>(
    { selectedPOIId: null },
    {
      onPOISelected: () => (poi: Point | null) => ({ selectedPOIId: poi ? poi.id : null }),
    },
  ),
  withProps(({ section }) => ({
    useSectionShapes: true,
    sections: [section.node],
    initialBounds: section.node.shape,
    contentBounds: section.node.shape,
    pois: section.node.pois,
    selectedSectionId: null,
    onSectionSelected: noop,
  })),
);
