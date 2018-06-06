import { action, observable } from 'mobx';
import { BoomPromoInfo, Region } from '../ww-commons';

export class StepperStore {
  // tslint:disable-next-line:typedef
  @observable activeStep = 0;
  @observable completed: Map<number, boolean> = new Map<number, boolean>();
  @observable promoInfo: BoomPromoInfo | null = null;
  @observable regionSku: string | null = null;

  @action.bound nextStep(payload?: any) {
    this.completed.set(this.activeStep, true);
    switch (this.activeStep) {
      case 1: // promo code received
        this.onPromoReceived(payload);
        break;
      case 2: // region selected
        this.onRegionSelected(payload);
        break;
      default:
        this.activeStep += 1;
    }
  }

  @action.bound prevStep() {
    switch (this.activeStep) {
      case 3:
        this.regionSku = null;
        break;
      case 2:
        this.promoInfo = null;
        break;
    }
    this.completed.set(this.activeStep - 1, false);
    this.activeStep -= 1;
  }

  onPromoReceived = (payload: BoomPromoInfo) => {
    this.promoInfo = payload;
    if (this.promoInfo && this.promoInfo.groupName) {
      this.activeStep = 3;
      this.completed.set(2, false);
    } else {
      this.activeStep = 2;
    }
  };

  onRegionSelected = (region: Region) => {
    if (!region.sku) {
      throw new Error('Region must have sku');
    }
    this.regionSku = region.sku;
    this.activeStep += 1;
  };
}