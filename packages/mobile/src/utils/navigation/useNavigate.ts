import { useNavigation } from '@zhigang1992/react-navigation-hooks';
import { useCallback } from 'react';

export const useNavigate = (routeName: string, params?: any) => {
  const { navigate } = useNavigation();
  return useCallback(() => {
    navigate(routeName, params);
  }, [routeName, params]);
};
