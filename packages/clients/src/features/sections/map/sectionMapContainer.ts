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
  withProps(({ section }: SectionMapProps) => ({
    useSectionShapes: true,
    sections: section.node ? [section.node] : [],
    initialBounds: section.node ? section.node.shape : null,
    contentBounds: section.node ? section.node.shape : null,
    pois: section.node ? section.node.pois : [],
    selectedSectionId: null,
    onSectionSelected: noop,
  })),
);
