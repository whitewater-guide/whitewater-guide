import { ContextUser } from '@apollo';
import db from '@db';
import { GroupRaw } from '@features/groups';
import { RegionRaw } from '@features/regions';
import { TransactionRaw } from './types';

export class PurchasesConnector {
  private readonly user?: ContextUser;
  private readonly language: string;
  private _transactions: TransactionRaw[] | null = null;
  private _purchasedGroups: GroupRaw[] | null = null;
  private _purchasedSingleRegions: RegionRaw[] | null = null;
  private _purchasedRegionIds: string[] | null = null; // both single and parts of groups

  constructor(user: ContextUser | undefined, language: string) {
    this.user = user;
    this.language = language;
  }

  private async getTransactions(): Promise<TransactionRaw[]> {
    if (!this.user) {
      this._transactions = [];
    }
    if (!this._transactions) {
      this._transactions = await db().table('transactions')
        .where({ user_id: this.user!.id, validated: true });
    }
    return this._transactions || [];
  }

  async getPurchasedGroups(): Promise<GroupRaw[]> {
    const transactions = await this.getTransactions();
    if (!this._purchasedGroups) {
      this._purchasedGroups = await db()
        .table('groups_view')
        .whereIn('sku', transactions.map((t) => t.product_id))
        .andWhere({ language: this.language });
    }
    return this._purchasedGroups || [];
  }

  async getPurchasedSingleRegions(): Promise<RegionRaw[]> {
    const transactions = await this.getTransactions();
    if (!this._purchasedSingleRegions) {
      this._purchasedSingleRegions = await db()
        .table('regions_view')
        .whereIn('sku', transactions.map((t) => t.product_id))
        .andWhere({ language: this.language });
    }
    return this._purchasedSingleRegions || [];
  }

  async getPurchasedRegions(): Promise<string[]> {
    if (!this.user) {
      this._purchasedRegionIds = [];
    }
    if (!this._purchasedRegionIds) {
      const result = await db()
        .table('regions')
        .select('id')
        .whereIn('regions.sku', (qb) => {
          qb.table('transactions')
            .where({ user_id: this.user!.id, validated: true })
            .select('product_id');
        })
        .orWhereIn('regions.id', (qb) => {
          qb.table('transactions')
            .innerJoin('groups', 'transactions.product_id', 'groups.sku')
            .innerJoin('regions_groups', 'groups.id', 'regions_groups.group_id')
            .where({ user_id: this.user!.id, validated: true })
            .select('regions_groups.region_id');
        });
      this._purchasedRegionIds = (result || []).map(({ id }: any) => id);
    }
    return this._purchasedRegionIds || [];
  }
}
