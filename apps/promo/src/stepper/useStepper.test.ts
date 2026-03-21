import { act, renderHook } from '@testing-library/react-hooks';
import type { BoomPromoInfo } from '@whitewater-guide/schema';

import type { PromoRegionFragment } from './promoRegion.generated';
import { Steps } from './Steps';
import type { StepperActions, StepperState } from './useStepper';
import { useStepper } from './useStepper';

interface Result {
  current: StepperState & StepperActions;
}

const mockRegion: PromoRegionFragment = {
  name: 'Mock Region',
  sku: 'region.sku',
} as any;

describe('active step: login', () => {
  let result: Result;

  beforeEach(() => {
    result = renderHook(useStepper).result;
    act(() => result.current.nextStep('Foo'));
  });

  it('should mark login step as completed', () => {
    expect(result.current.completedSteps[Steps.LOGIN]).toBe(true);
  });

  it('should go to enter code step', () => {
    expect(result.current.activeStep).toBe(Steps.ENTER_CODE);
  });
});

describe('active step: enter code', () => {
  let result: Result;

  beforeEach(() => {
    result = renderHook(useStepper, {
      initialProps: {
        activeStep: Steps.ENTER_CODE,
        completedSteps: { [Steps.LOGIN]: true },
        region: null,
        promo: null,
      },
    }).result;
  });

  describe('enter single region code', () => {
    const promo: BoomPromoInfo = {
      id: 'id',
      code: 'code',
      groupName: null,
      groupSku: null,
      redeemed: false,
    };
    beforeEach(() => {
      act(() => result.current.nextStep(promo));
    });

    it('should mark enter code step as completed', () => {
      expect(result.current.completedSteps[Steps.ENTER_CODE]).toBe(true);
    });

    it('should go to select region code step', () => {
      expect(result.current.activeStep).toBe(Steps.SELECT_REGION);
    });

    it('should set promo', () => {
      expect(result.current.promo).toEqual(promo);
    });
  });

  describe('enter regions group code', () => {
    const promo: BoomPromoInfo = {
      id: 'id',
      code: 'code',
      groupName: 'group',
      groupSku: 'sku',
      redeemed: false,
    };
    beforeEach(() => {
      act(() => result.current.nextStep(promo));
    });

    it('should mark enter code step as completed', () => {
      expect(result.current.completedSteps[Steps.ENTER_CODE]).toBe(true);
    });

    it('should mark select region step as not completed', () => {
      expect(result.current.completedSteps[Steps.SELECT_REGION]).toBe(false);
    });

    it('should go to confirm step', () => {
      expect(result.current.activeStep).toBe(Steps.CONFIRM);
    });

    it('should set promo', () => {
      expect(result.current.promo).toEqual(promo);
    });
  });

  describe('go back', () => {
    beforeEach(() => {
      act(() => result.current.prevStep());
    });

    it('should mark login step as current', () => {
      expect(result.current.activeStep).toEqual(Steps.LOGIN);
    });

    it('should mark login step not completed', () => {
      expect(result.current.completedSteps[Steps.LOGIN]).toBeFalsy();
    });
  });
});

describe('active step: select region', () => {
  let result: Result;

  beforeEach(() => {
    result = renderHook(useStepper, {
      initialProps: {
        activeStep: Steps.SELECT_REGION,
        completedSteps: { [Steps.LOGIN]: true, [Steps.ENTER_CODE]: true },
        region: null,
        promo: {
          id: 'id',
          code: 'code',
          groupName: null,
          groupSku: null,
          redeemed: false,
        },
      },
    }).result;
  });

  describe('next', () => {
    beforeEach(() => {
      act(() => result.current.nextStep(mockRegion));
    });

    it('should mark select region as completed', () => {
      expect(result.current.completedSteps[Steps.SELECT_REGION]).toBe(true);
    });
    it('should set confirm step as current', () => {
      expect(result.current.activeStep).toEqual(Steps.CONFIRM);
    });
    it('should set region', () => {
      expect(result.current.region).toEqual(mockRegion);
    });
  });

  describe('prev', () => {
    beforeEach(() => {
      act(() => result.current.prevStep());
    });

    it('should mark enter promo step as not completed', () => {
      expect(result.current.completedSteps[Steps.ENTER_CODE]).toBeFalsy();
    });
    it('should set enter promo step as current', () => {
      expect(result.current.activeStep).toEqual(Steps.ENTER_CODE);
    });
    it('should clear promo', () => {
      expect(result.current.promo).toBeNull();
    });
  });
});

describe('active step: confirm', () => {
  let result: Result;

  describe('single region promo', () => {
    const state = {
      activeStep: Steps.CONFIRM,
      completedSteps: {
        [Steps.LOGIN]: true,
        [Steps.ENTER_CODE]: true,
        [Steps.SELECT_REGION]: true,
      },
      region: mockRegion,
      promo: {
        id: 'id',
        code: 'code',
        groupName: null,
        groupSku: null,
        redeemed: false,
      },
    };

    beforeEach(() => {
      result = renderHook(useStepper, { initialProps: state }).result;
    });

    it('next should not change state', () => {
      act(() => result.current.nextStep());
      expect(result.current).toMatchObject(state);
    });

    describe('prev', () => {
      beforeEach(() => {
        act(() => result.current.prevStep());
      });

      it('should mark confirm step as not completed', () => {
        expect(result.current.completedSteps[Steps.CONFIRM]).toBeFalsy();
      });
      it('should set select region step as current', () => {
        expect(result.current.activeStep).toEqual(Steps.SELECT_REGION);
      });
      it('should clear region', () => {
        expect(result.current.region).toBeNull();
      });
      it('should not affect promo code', () => {
        expect(result.current.promo).toEqual(state.promo);
      });
    });
  });

  describe('regions group promo', () => {
    const state = {
      activeStep: Steps.CONFIRM,
      completedSteps: {
        [Steps.LOGIN]: true,
        [Steps.ENTER_CODE]: true,
        [Steps.SELECT_REGION]: false,
      },
      region: null,
      promo: {
        id: 'id',
        code: 'code',
        groupName: 'groupName',
        groupSku: 'groupSku',
        redeemed: false,
      },
    };

    beforeEach(() => {
      result = renderHook(useStepper, { initialProps: state }).result;
    });

    it('next should not change state', () => {
      act(() => result.current.nextStep());
      expect(result.current).toMatchObject(state);
    });

    describe('prev', () => {
      beforeEach(() => {
        act(() => result.current.prevStep());
      });

      it('should mark confirm step as not completed', () => {
        expect(result.current.completedSteps[Steps.CONFIRM]).toBeFalsy();
      });
      it('should set enter promo step as current', () => {
        expect(result.current.activeStep).toEqual(Steps.ENTER_CODE);
      });
      it('should clear promo', () => {
        expect(result.current.promo).toBeNull();
      });
      it('should not affect region', () => {
        expect(result.current.region).toBeNull();
      });
    });
  });
});
