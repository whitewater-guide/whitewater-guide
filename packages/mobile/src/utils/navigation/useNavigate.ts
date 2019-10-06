import { useCallback } from 'react';
import { useNavigation } from 'react-navigation-hooks';

export const useNavigate = (routeName: string, params?: any) => {
  const { navigate } = useNavigation();
  return useCallback(() => {
    navigate(routeName, params);
  }, [routeName, params]);
};
