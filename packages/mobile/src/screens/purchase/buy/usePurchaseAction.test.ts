import { act, renderHook } from '@testing-library/react-hooks';
// @ts-ignore
import { IAPErrorCode, ProductPurchase, _mockResponse } from 'react-native-iap';
import { IAPError } from '../../../features/purchases';
import safeAcknowledgePurchase from './safeAcknowledgePurchase';
import safeRestorePurchase from './safeRestorePurchase';
import usePurchaseAction from './usePurchaseAction';

const SKU = 'Region.sku.1';

const PURCHASE: ProductPurchase = {
  productId: SKU,
  transactionId: '__transactionId__',
  transactionDate: new Date(2018, 1, 1).valueOf(),
  transactionReceipt: '__transactionReceipt__',
};

const SAVE_SUCCESS = {
  error: undefined,
  saved: true,
};

const SAVE_ERROR = {
  error: new IAPError('screens:purchase.buy.errors.savePurchase'),
  saved: false,
};

const ACKNOWLEDGE_SUCCESS = {
  error: undefined,
  acknowledged: true,
};

const ACKNOWLEDGE_ERROR = {
  error: new IAPError('screens:purchase.buy.errors.acknowledge'),
  acknowledged: false,
};

const RESTORE_SUCCESS = {
  purchase: PURCHASE,
  error: undefined,
};

const RESTORE_ERROR = {
  purchase: undefined,
  error: new IAPError('screens:purchase.buy.errors.restoreFailed'),
};

const mockNavigate = jest.fn();
const mockSavePurchase = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...require.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('./useSavePurchase', () => () => mockSavePurchase);
jest.mock('./safeAcknowledgePurchase');
jest.mock('./safeRestorePurchase');

let rendered: any;

const renderAndPress = () => {
  const renderResult = renderHook(() => usePurchaseAction(SKU));
  act(() => {
    renderResult.result.current.onPress();
  });
  rendered = renderResult;
  return renderResult;
};

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  rendered.unmount();
});

it('should start in idle state', () => {
  mockSavePurchase.mockResolvedValue({ saved: true, error: undefined });
  (safeAcknowledgePurchase as jest.Mock).mockResolvedValue(ACKNOWLEDGE_SUCCESS);
  rendered = renderHook(() => usePurchaseAction(SKU));

  expect(rendered.result.current).toEqual({
    loading: false,
    error: undefined,
    onPress: expect.any(Function),
  });
});

it('should return to idle state if users cancels', async () => {
  _mockResponse.mockReturnValue({
    purchase: undefined,
    error: { code: IAPErrorCode.E_USER_CANCELLED },
  });
  const { result, waitForNextUpdate } = renderAndPress();
  await waitForNextUpdate();
  expect(result.current).toMatchObject({
    loading: false,
    error: undefined,
  });
});

it('should display error if request purchase fails', async () => {
  _mockResponse.mockReturnValue({
    purchase: undefined,
    error: { code: IAPErrorCode.E_NETWORK_ERROR },
  });
  const { result, waitForNextUpdate } = renderAndPress();
  await waitForNextUpdate();
  expect(result.current).toMatchObject({
    loading: false,
    error: { message: expect.stringContaining('errors.requestPurchase') },
  });
});

describe('purchase already owned', () => {
  beforeEach(() => {
    _mockResponse
      .mockReturnValueOnce({
        purchase: undefined,
        error: { code: IAPErrorCode.E_ALREADY_OWNED },
      })
      .mockReturnValue({ purchase: PURCHASE, error: undefined });
  });

  it('should return error if restore fails', async () => {
    (safeRestorePurchase as jest.Mock).mockResolvedValue(RESTORE_ERROR);
    const { result, waitForNextUpdate } = renderAndPress();
    await waitForNextUpdate();
    expect(result.current).toMatchObject({
      loading: false,
      error: { message: expect.stringContaining('errors.restoreFailed') },
    });
  });

  it('should be able to recover error if restore fails', async () => {
    (safeRestorePurchase as jest.Mock).mockResolvedValue(RESTORE_ERROR);
    mockSavePurchase.mockResolvedValue(SAVE_SUCCESS);
    (safeAcknowledgePurchase as jest.Mock).mockResolvedValue(
      ACKNOWLEDGE_SUCCESS,
    );
    const { result, waitForNextUpdate } = renderAndPress();
    await waitForNextUpdate();
    act(() => {
      result.current.onPress();
    });
    await waitForNextUpdate();
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('should finish the process if restore succeeds', async () => {
    (safeRestorePurchase as jest.Mock).mockResolvedValue(RESTORE_SUCCESS);
    mockSavePurchase.mockResolvedValue(SAVE_SUCCESS);
    (safeAcknowledgePurchase as jest.Mock).mockResolvedValue(
      ACKNOWLEDGE_SUCCESS,
    );
    const { waitForNextUpdate } = renderAndPress();
    await waitForNextUpdate();
    expect(mockNavigate).toHaveBeenCalled();
  });
});

describe('request purchase success', () => {
  beforeEach(() => {
    _mockResponse.mockReturnValue({ purchase: PURCHASE, error: undefined });
  });

  describe('save purchase error', () => {
    beforeEach(() => {
      mockSavePurchase
        .mockResolvedValueOnce(SAVE_ERROR)
        .mockResolvedValueOnce(SAVE_SUCCESS);
      (safeAcknowledgePurchase as jest.Mock).mockResolvedValue(
        ACKNOWLEDGE_SUCCESS,
      );
    });

    it('should return error', async () => {
      const { result, waitForNextUpdate } = renderAndPress();
      await waitForNextUpdate();
      expect(result.current).toMatchObject({
        loading: false,
        error: { message: expect.stringContaining('errors.savePurchase') },
      });
    });

    it('should finish process when user retries', async () => {
      const { result, waitForNextUpdate } = renderAndPress();
      await waitForNextUpdate();
      act(() => {
        result.current.onPress();
      });
      await waitForNextUpdate();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('save purchase success', () => {
    beforeEach(() => {
      mockSavePurchase.mockResolvedValueOnce(SAVE_SUCCESS);
    });

    describe('acknowledge error', () => {
      beforeEach(() => {
        (safeAcknowledgePurchase as jest.Mock)
          .mockResolvedValueOnce(ACKNOWLEDGE_ERROR)
          .mockResolvedValueOnce(ACKNOWLEDGE_SUCCESS);
      });

      it('should return error', async () => {
        const { result, waitForNextUpdate } = renderAndPress();
        await waitForNextUpdate();
        expect(result.current).toMatchObject({
          loading: false,
          error: { message: expect.stringContaining('errors.acknowledge') },
        });
      });

      it('should finish process when user retries', async () => {
        const { result, waitForNextUpdate } = renderAndPress();
        await waitForNextUpdate();
        act(() => {
          result.current.onPress();
        });
        await waitForNextUpdate();
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    describe('acknowledge success', () => {
      beforeEach(() => {
        (safeAcknowledgePurchase as jest.Mock).mockResolvedValue(
          ACKNOWLEDGE_SUCCESS,
        );
      });

      it('should display loading state', async () => {
        const { result } = renderAndPress();
        expect(result.current.loading).toBeTruthy();
      });

      it('should finish process', async () => {
        const { waitForNextUpdate } = renderAndPress();
        await waitForNextUpdate();
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });
});
