import { useRegion } from '@whitewater-guide/clients';
import { Text } from 'react-native';

import theme from '../../theme';

function RegionTitle() {
  const region = useRegion();
  const name = region?.name;
  if (!name) {
    return null;
  }
  return (
    <Text
      numberOfLines={1}
      style={{ fontSize: 18, color: theme.colors.textLight }}
    >
      {name}
    </Text>
  );
}

export default RegionTitle;
