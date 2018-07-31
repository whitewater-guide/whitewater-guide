import { purchaseActions } from './actions';
import { basePurchaseReducer, initialState } from './reducer';
import { PremiumRegion } from './types';

const region: PremiumRegion = {
  id: 'region_id',
  name: 'Premium region',
  hasPremiumAccess: false,
  sections: { nodes: [], count: 0 },
  sku: 'sku',
};

it('should open dialog', () => {
  const newState = basePurchaseReducer(
    initialState,
    purchaseActions.openDialog({ region, sectionId: 'section_id' }),
  );
  expect(newState.dialogOpen).toBe(true);
  expect(newState.dialogData).toEqual({ region, sectionId: 'section_id' });
});
