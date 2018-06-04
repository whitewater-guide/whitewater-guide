import ApolloClient from 'apollo-client';
import { action, flow, observable } from 'mobx';
import { getApolloClient } from '../../apollo';
import { PurchaseInput, PurchasePlatform } from '../../ww-commons';
import { ACTIVATE_PROMO_MUTATION } from './activatePromo.mutation';

export class ConfirmStepStore {
  private client: ApolloClient<any> = getApolloClient();
  // tslint:disable-next-line:typedef
  @observable loading = false;
  @observable error: string | null = null;

  activatePromo: (code: string, sku: string) => Promise<boolean> =
    flow(function *activatePromo(this: ConfirmStepStore, code: string, sku: string) {
      const purchase: PurchaseInput = {
        platform: PurchasePlatform.boomstarter,
        transactionId: code,
        productId: sku,
      };
      this.loading = true;
      let success = false;
      try {
        const { data, errors } = yield this.client.mutate<boolean>({
          mutation: ACTIVATE_PROMO_MUTATION,
          variables: { purchase },
        });
        success = data ? !!data.addPurchase : false;
        const hasErrors = errors && errors.length > 0;
        if (hasErrors) {
          console.log(errors);
        }
        this.error = success ? null : 'Похоже этот промо код не подходит';
      } catch (e) {
        this.error = 'Упс! Что-то сломалось. Попробуйте заново';
      } finally {
        this.loading = false;
      }
      return success;
    }).bind(this);

  @action.bound reset() {
    this.loading = false;
    this.error = null;
  }
}
