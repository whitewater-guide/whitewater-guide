import { action, observable } from 'mobx';
import { BoomPromoInfo } from '../ww-commons';

export class StepperStore {
  // tslint:disable-next-line:typedef
  @observable activeStep = 0;
  @observable completed: Map<number, boolean> = new Map<number, boolean>();
  @observable promoInfo: BoomPromoInfo | null = null;
  @observable regionSku: string | null = null;

  @action.bound nextStep(payload?: any) {
    this.completed.set(this.activeStep, true);
    if (this.activeStep === 1) {
      this.promoInfo = payload;
      if (this.promoInfo && this.promoInfo.groupName) {
        this.activeStep = 3;
        this.completed.set(2, false);
      } else {
        this.activeStep = 2;
      }
    } else {
      this.activeStep += 1;
    }
  }

  @action.bound prevStep() {
    this.completed.set(this.activeStep - 1, false);
    this.activeStep -= 1;
  }
}
