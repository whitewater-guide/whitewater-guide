import {
  MutationSavePurchaseArgs,
  PurchaseInput,
  PurchaseInputSchema,
  PurchasePlatform,
} from '@whitewater-guide/schema';
import { AuthenticationError } from 'apollo-server-koa';
import { isValidated, validate } from 'in-app-purchase';
import { QueryBuilder, Transaction } from 'knex';
import * as yup from 'yup';

import {
  ContextUser,
  isInputValidResolver,
  MutationNotAllowedError,
  MutationResolvers,
} from '~/apollo';
import { db, Sql } from '~/db';

import logger from '../logger';
import { acknowledgeAndroid } from './utils';

const Schema: yup.SchemaOf<MutationSavePurchaseArgs> = yup.object({
  purchase: PurchaseInputSchema.clone(),
  sectionId: yup.string().uuid().notRequired().nullable(),
});

const processBoomstarterPurchase = async (
  purchase: PurchaseInput,
  user: ContextUser,
) => {
  const promo: Sql.BoomPromos | undefined = await db()
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
    const transaction: Partial<Sql.Transactions> = {
      user_id: user.id,
      platform: PurchasePlatform.boomstarter,
      transaction_id: purchase.transactionId,
      product_id: purchase.productId,
      validated: true,
    };
    await trx.insert(transaction).into('transactions');
    await trx('boom_promos')
      .update({ redeemed: true })
      .where({ code: purchase.transactionId });
  });
};

const processIAP = async (purchase: PurchaseInput, user: ContextUser) => {
  let validated = false;
  let response: any;
  if (purchase.platform === PurchasePlatform.android) {
    response = await acknowledgeAndroid(purchase, user.id);
    validated = true;
  } else {
    if (!purchase.receipt) {
      throw new Error('empty purchase receipt');
    }
    response = await validate(purchase.receipt);
    validated = isValidated(response);
  }
  const transaction: Partial<Sql.Transactions> = {
    user_id: user.id,
    platform: purchase.platform as Sql.PlatformType,
    transaction_id: purchase.transactionId,
    transaction_date: purchase.transactionDate,
    product_id: purchase.productId,
    receipt: purchase.receipt,
    extra: response,
    validated,
  };
  await db().insert(transaction).into('transactions');
};

const savePurchase: MutationResolvers['savePurchase'] = async (
  _,
  { purchase, sectionId },
  context,
  info,
) => {
  const { user, dataSources } = context;
  if (!user) {
    throw new AuthenticationError('must be authenticated');
  }
  const { transactionId, productId, platform } = purchase;

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
    if (!sameUser) {
      throw new MutationNotAllowedError('Duplicate transaction');
    }
  } else {
    try {
      if (purchase.platform === PurchasePlatform.boomstarter) {
        await processBoomstarterPurchase(purchase, user);
      } else {
        await processIAP(purchase, user);
      }
    } catch (e) {
      logger.warn({ extra: { platform, transactionId }, error: e });
      throw e;
    }
  }

  const regionInfo = {
    fieldNodes: [info.fieldNodes[0].selectionSet?.selections[0]],
  };
  let regionQuery = dataSources.regions.getMany(regionInfo, {
    where: { premium: true },
  });
  if (productId.startsWith('region')) {
    regionQuery = regionQuery.where({ sku: productId });
  } else {
    regionQuery = regionQuery.whereExists((qb: QueryBuilder) => {
      qb.select('*')
        .from('groups')
        .innerJoin('regions_groups', 'groups.id', 'regions_groups.group_id')
        .where({ sku: productId })
        .andWhereRaw('regions_groups.region_id = regions_view.id');
    });
  }
  const [regions, section] = await Promise.all([
    regionQuery,
    dataSources.sections.getById(sectionId),
  ]);
  return { regions, section };
};

export default isInputValidResolver(Schema, savePurchase);
