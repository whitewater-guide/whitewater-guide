import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../core/redux';
import { updateSettings } from './actions';
import { AppSettings } from './types';

const mapTypeSelector = (state: RootState) => state.settings.mapType;

export const useMapType = () => {
  const dispatch = useDispatch();
  const mapType = useSelector(mapTypeSelector);
  const setMapType = useCallback(
    (mt: AppSettings['mapType']) => dispatch(updateSettings({ mapType: mt })),
    [dispatch],
  );
  return { mapType, setMapType };
};
