import {
  Context,
  isInputValidResolver,
  MutationNotAllowedError,
} from '@apollo';
import db from '@db';
import {
  PurchaseInput,
  PurchaseInputStruct,
  PurchasePlatform,
} from '@whitewater-guide/commons';
import { AuthenticationError } from 'apollo-server';
import { isValidated, validate } from 'in-app-purchase';
import { Transaction } from 'knex';
import { struct } from 'superstruct';
import logger from '../logger';
import { BoomPromoRaw, TransactionRaw } from '../types';

interface Vars {
  purchase: PurchaseInput;
}

const Struct = struct.object({
  purchase: PurchaseInputStruct,
});

const processBoomstarterPurchase = async (
  purchase: PurchaseInput,
  { user }: Context,
) => {
  const promo: BoomPromoRaw | undefined = await db()
    .table('boom_promos')
    .where({ code: purchase.transactionId })
    .first();
  if (!promo) {
    throw new MutationNotAllowedError('Bad promo code');
  }
  if (promo.group_sku && promo.group_sku !== purchase.productId) {
    throw new MutationNotAllowedError('Promo code and product do not match');
  }
  if (promo.redeemed) {
    throw new MutationNotAllowedError('Promo code already redeemed');
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
  const receipt =
    purchase.platform === PurchasePlatform.android
      ? JSON.parse(purchase.receipt!)
      : purchase.receipt!;
  const response = await validate(receipt);
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
  await db()
    .insert(transaction)
    .into('transactions');
  return true;
};

const addPurchase = isInputValidResolver<Vars>(
  Struct,
  async (_: any, { purchase }: Vars, context: Context) => {
    const { user } = context;
    if (!user) {
      throw new AuthenticationError('must be authenticated');
    }
    const { transactionId, platform } = purchase;

    // check if transaction already added
    const transaction = await db()
      .table('transactions')
      .where({
        transaction_id: purchase.transactionId,
        platform: purchase.platform,
      })
      .first();

    if (transaction) {
      const sameUser = transaction.user_id === user.id;
      logger.warn({
        extra: {
          platform,
          transactionId,
          sameUser,
        },
        message: 'Duplicate transaction',
      });
      if (sameUser) {
        return false;
      }
      throw new MutationNotAllowedError('Duplicate transaction');
    }

    try {
      if (purchase.platform === PurchasePlatform.boomstarter) {
        return processBoomstarterPurchase(purchase, context);
      } else {
        return processIAP(purchase, context);
      }
    } catch (e) {
      logger.warn({ extra: { platform, transactionId }, error: e });
      throw e;
    }
  },
);

export default addPurchase;
