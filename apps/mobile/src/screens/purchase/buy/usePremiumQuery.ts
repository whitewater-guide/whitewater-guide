import type { PremiumRegion } from '../../../features/purchases';
import { IAPError } from '../../../features/purchases';
import { usePremiumDialogQuery } from './premiumDialog.generated';

export default (region: PremiumRegion, sectionId?: string) => {
  const { data, loading, error, refetch } = usePremiumDialogQuery({
    fetchPolicy: 'network-only',
    variables: { regionId: region.id, sectionId },
  });
  const hasPremiumAccess = !!data?.region?.hasPremiumAccess;
  return {
    hasPremiumAccess,
    me: data?.me,
    loading,
    error: error
      ? new IAPError(
          'screens:purchase.buy.errors.refreshPremium',
          JSON.stringify(error, null, 2),
        )
      : undefined,
    refetch,
  };
};
