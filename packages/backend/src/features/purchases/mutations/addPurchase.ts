import { isValidated, validate } from 'in-app-purchase';
import Joi from 'joi';
import { Transaction } from 'knex';
import { AuthenticationRequiredError, Context, isInputValidResolver, MutationNotAllowedError } from '../../../apollo';
import db from '../../../db';
import { PurchaseInput, PurchasePlatform } from '../../../ww-commons';
import { BoomPromoRaw, TransactionRaw } from '../types';

interface Vars {
  purchase: PurchaseInput;
}

const PurchaseInputSchema = Joi.object().keys({
  platform: Joi.any().allow(PurchasePlatform),
  transactionId: Joi.string().min(3),
  transactionDate: Joi.date().allow(null).optional(),
  productId: Joi.string().min(3),
  receipt: Joi.string().allow('').allow(null).optional(),
  extra: Joi.object().min(1).allow(null).optional(),
});

const Schema = Joi.object().keys({
  purchase: PurchaseInputSchema,
});

const processBoomstarterPurchase = async (purchase: PurchaseInput, { user }: Context) => {
  const promo: BoomPromoRaw | undefined = await db().table('boom_promos')
    .where({ code: purchase.transactionId }).
    first();
  if (!promo) {
    throw new MutationNotAllowedError({ message: 'Bad promo code' });
  }
  if (promo.group_sku && promo.group_sku !== purchase.productId) {
    throw new MutationNotAllowedError({ message: 'Promo code and product do not match' });
  }
  if (promo.redeemed) {
    throw new MutationNotAllowedError({ message: 'Promo code already redeemed' });
  }
  await db().transaction(async (trx: Transaction) => {
    const transaction: Partial<TransactionRaw> = {
      user_id: user!.id,
      platform: PurchasePlatform.boomstarter,
      transaction_id: purchase.transactionId,
      product_id: purchase.productId,
      validated: true,
    };
    await trx!.insert(transaction).into('transactions');
    await trx('boom_promos')
      .update({ redeemed: true })
      .where({ code: purchase.transactionId });
  });
  return true;
};

const processIAP = async (purchase: PurchaseInput, { user }: Context) => {
  const response = await validate(purchase.receipt!);
  const validated = isValidated(response);
  const transaction: Partial<TransactionRaw> = {
    user_id: user!.id,
    platform: purchase.platform,
    transaction_id: purchase.transactionId,
    transaction_date: purchase.transactionDate,
    product_id: purchase.productId,
    receipt: purchase.receipt,
    extra: response,
    validated,
  };
  await db().insert(transaction).into('transactions');
  return true;
};

const addPurchase = isInputValidResolver(Schema).createResolver(
  async (_: any, { purchase }: Vars, context: Context) => {
    const { user } = context;
    if (!user) {
      throw new AuthenticationRequiredError();
    }

    // check if transaction already added
    const transaction = await db().table('transactions')
      .where({ transaction_id: purchase.transactionId, platform: purchase.platform })
      .first();

    if (transaction) {
      if (transaction.user_id === user.id) {
        return false;
      }
      throw new MutationNotAllowedError({ message: 'Duplicate transaction' });
    }

    if (purchase.platform === PurchasePlatform.boomstarter) {
      return processBoomstarterPurchase(purchase, context);
    } else {
      return processIAP(purchase, context);
    }
  },
);

export default addPurchase;
