import type { Context, ContextUser } from '../../apollo/index';
import type { Sql } from '../../db/index';
import { db } from '../../db/index';

export class PurchasesConnector {
  private _user?: ContextUser;

  private _language!: string;

  private _transactions: Sql.Transactions[] | null = null;

  private _purchasedGroups: Sql.GroupsView[] | null = null;

  private _purchasedSingleRegions: Sql.RegionsView[] | null = null;

  private _purchasedRegionIds: string[] | null = null; // both single and parts of groups

  constructor(context: Context) {
    this._user = context.user;
    this._language = context.language;
  }

  private async getTransactions(): Promise<Sql.Transactions[]> {
    if (!this._user) {
      this._transactions = [];
    } else if (!this._transactions) {
      this._transactions = await db()
        .table('transactions')
        .where({ user_id: this._user.id, validated: true });
    }
    return this._transactions || [];
  }

  async getPurchasedGroups(): Promise<Sql.GroupsView[]> {
    const transactions = await this.getTransactions();
    if (!this._purchasedGroups) {
      this._purchasedGroups = await db()
        .table('groups_view')
        .whereIn(
          'sku',
          transactions.map((t) => t.product_id),
        )
        .andWhere({ language: this._language });
    }
    return this._purchasedGroups || [];
  }

  async getPurchasedSingleRegions(): Promise<Sql.RegionsView[]> {
    const transactions = await this.getTransactions();
    if (!this._purchasedSingleRegions) {
      this._purchasedSingleRegions = await db()
        .table('regions_view')
        .whereIn(
          'sku',
          transactions.map((t) => t.product_id),
        )
        .andWhere({ language: this._language });
    }
    return this._purchasedSingleRegions || [];
  }

  async getPurchasedRegions(): Promise<string[]> {
    if (!this._user) {
      this._purchasedRegionIds = [];
    } else if (!this._purchasedRegionIds) {
      const user_id = this._user.id;
      const result = await db()
        .table('regions')
        .select('id')
        .whereIn('regions.sku', (qb) => {
          qb.table('transactions')
            .where({ user_id, validated: true })
            .select('product_id');
        })
        .orWhereIn('regions.id', (qb) => {
          qb.table('transactions')
            .innerJoin('groups', 'transactions.product_id', 'groups.sku')
            .innerJoin('regions_groups', 'groups.id', 'regions_groups.group_id')
            .where({ user_id, validated: true })
            .select('regions_groups.region_id');
        });
      this._purchasedRegionIds = (result || []).map(({ id }: any) => id);
    }
    return this._purchasedRegionIds || [];
  }
}
