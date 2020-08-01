import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import { useCallback, useState } from 'react';
import { Screens } from '~/core/navigation';

export default function useFABAuth() {
  const [open, setOpen] = useState(false);
  const { me } = useAuth();
  const { navigate } = useNavigation();

  const onStateChange = useCallback(
    (state: { open: boolean }) => {
      if (me) {
        setOpen(state.open);
      } else {
        setOpen(false);
        navigate(Screens.AUTH_STACK);
      }
    },
    [me, setOpen, navigate],
  );

  return { open, onStateChange };
}
