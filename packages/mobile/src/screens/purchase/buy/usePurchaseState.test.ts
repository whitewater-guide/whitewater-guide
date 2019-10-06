import { act, renderHook } from '@testing-library/react-hooks';
import { ApolloError } from 'apollo-client';
import { IAPError, PremiumRegion, useIap } from '../../../features/purchases';
import Screens from '../../screen-names';
import usePremiumQuery from './usePremiumQuery';
import usePurchaseAction from './usePurchaseAction';
import usePurchaseState from './usePurchaseState';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockIap = jest.fn();
const mockPremiumQuery = jest.fn();
const mockPurchaseAction = jest.fn();

jest.mock('react-navigation-hooks', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
}));
jest.mock('../../../features/purchases', () => {
  const originalModule = jest.requireActual('../../../features/purchases');
  return {
    __esModule: true,
    ...originalModule,
    useIap: () => mockIap(),
  };
});
jest.mock('./usePremiumQuery', () => () => mockPremiumQuery());
jest.mock('./usePurchaseAction', () => () => mockPurchaseAction());

interface Mocks {
  iap?: Partial<ReturnType<typeof useIap>>;
  premium?: Partial<ReturnType<typeof usePremiumQuery>>;
  action?: Partial<ReturnType<typeof usePurchaseAction>>;
}

const setupMocks = (mocks: Mocks = {}) => {
  const iap = jest.fn();
  const premium = jest.fn();
  const action = jest.fn();

  mockIap.mockReturnValue({
    canMakePayments: true,
    loading: false,
    products: new Map([
      ['Region.sku.1', { localizedPrice: '100', productId: 'Region.sku.1' }],
    ]),
    error: undefined,
    refresh: iap,
    ...mocks.iap,
  });
  mockPremiumQuery.mockReturnValue({
    hasPremiumAccess: false,
    me: { id: '__uid__', verified: true },
    loading: false,
    error: undefined,
    refetch: premium,
    ...mocks.premium,
  });
  mockPurchaseAction.mockReturnValue({
    loading: false,
    onPress: action,
    error: undefined,
    ...mocks.action,
  });
  return { iap, premium, action };
};

const region: PremiumRegion = {
  id: '__id__',
  name: '__name__',
  hasPremiumAccess: false,
  premium: true,
  sku: 'Region.sku.1',
};

beforeEach(() => {
  jest.resetAllMocks();
});

it('should display error and refetch products when iap fails', () => {
  const { iap } = setupMocks({
    iap: { error: new IAPError('iap:errors.fetchProduct') },
  });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    error: expect.objectContaining({ message: 'iap:errors.fetchProduct' }),
    button: expect.stringContaining('retry'),
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(iap).toHaveBeenCalled();
  unmount();
});

it('should display error and refetch products when premium query fails', () => {
  const { premium } = setupMocks({
    premium: { error: new ApolloError({ errorMessage: 'epic fail' }) },
  });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    error: expect.objectContaining({ message: 'epic fail' }),
    button: expect.stringContaining('retry'),
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(premium).toHaveBeenCalled();
  unmount();
});

it('should display loading state when iap is loading', () => {
  setupMocks({
    iap: { loading: true, products: new Map() },
  });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    loading: true,
    button: expect.stringContaining('noPrice'),
  });
  unmount();
});

it('should display fatal error when product cannot be found', () => {
  setupMocks();
  const { result, unmount } = renderHook(() =>
    usePurchaseState({ ...region, sku: 'Region.sku.2' }, '__sectionId__'),
  );
  expect(result.current).toEqual({
    error: expect.objectContaining({ message: 'iap:errors.notFound' }),
    button: expect.stringContaining('commons:ok'),
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(mockGoBack).toHaveBeenCalled();
  unmount();
});

it('should display fatal error when cannot make payment', () => {
  setupMocks({ iap: { canMakePayments: false } });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    error: expect.objectContaining({
      message: 'iap:errors.cannotMakePayments',
    }),
    button: expect.stringContaining('commons:ok'),
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(mockGoBack).toHaveBeenCalled();
  unmount();
});

it('should display loading when premium query is loading', () => {
  setupMocks({ premium: { loading: true } });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    button: 'iap:buy.confirmButton.buy',
    loading: true,
  });
  unmount();
});

it('should lead to already owned screen when already owned', () => {
  setupMocks({ premium: { hasPremiumAccess: true } });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    button: 'iap:buy.confirmButton.buy',
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(mockNavigate).toHaveBeenCalledWith(Screens.Purchase.AlreadyHave);
  unmount();
});

it('should lead to auth screen when not logged in', () => {
  setupMocks({ premium: { me: null } });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    button: 'iap:buy.confirmButton.buy',
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(mockNavigate).toHaveBeenCalledWith({
    routeName: Screens.Auth.Root,
    key: Screens.Auth.Root,
  });
  unmount();
});

it('should lead to verify screen when not verified', () => {
  setupMocks({ premium: { me: { verified: false } as any } });
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    button: 'iap:buy.confirmButton.buy',
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(mockNavigate).toHaveBeenCalledWith(Screens.Purchase.Verify);
  unmount();
});

it('should display purchase flow', () => {
  const { action } = setupMocks();
  const { result, unmount } = renderHook(() =>
    usePurchaseState(region, '__sectionId__'),
  );
  expect(result.current).toEqual({
    button: 'iap:buy.confirmButton.buy',
    loading: false,
    error: undefined,
    onPress: expect.any(Function),
  });
  act(() => {
    result.current.onPress!();
  });
  expect(action).toHaveBeenCalled();
  unmount();
});
