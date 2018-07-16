import { ContextUser } from '../../../apollo';
import db from '../../../db/db';
import { GroupRaw } from '../../groups';
import { RegionRaw } from '../../regions';
import { TransactionRaw } from '../types';

export class PurchasesLoader {
  private user?: ContextUser;
  private language: string;
  private transactions: TransactionRaw[];
  private purchasedGroups: GroupRaw[];
  private purchasedSingleRegions: RegionRaw[];
  private purchasedRegionIds: string[]; // both single and parts of groups

  constructor(user: ContextUser | undefined, language: string) {
    this.user = user;
    this.language = language;
  }

  async loadTransactions(): Promise<TransactionRaw[]> {
    if (!this.user) {
      this.transactions = [];
    }
    if (!this.transactions) {
      this.transactions = await db().table('transactions')
        .where({ user_id: this.user!.id, validated: true });
    }
    return this.transactions;
  }

  async loadPurchasedGroups() {
    const transactions = await this.loadTransactions();
    if (!this.purchasedGroups) {
      this.purchasedGroups = await db()
        .table('groups_view')
        .whereIn('sku', transactions.map((t) => t.product_id))
        .andWhere({ language: this.language });
    }
    return this.purchasedGroups;
  }

  async loadPurchasedSingleRegions() {
    const transactions = await this.loadTransactions();
    if (!this.purchasedSingleRegions) {
      this.purchasedSingleRegions = await db()
        .table('regions_view')
        .whereIn('sku', transactions.map((t) => t.product_id))
        .andWhere({ language: this.language });
    }
    return this.purchasedSingleRegions;
  }

  async loadPurchasedRegions() {
    if (!this.user) {
      this.purchasedRegionIds = [];
    }
    if (!this.purchasedRegionIds) {
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
      this.purchasedRegionIds = (result || []).map(({ id }: any) => id);
    }
    return this.purchasedRegionIds;
  }
}
