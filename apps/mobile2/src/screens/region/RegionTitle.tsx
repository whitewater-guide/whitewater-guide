import { Text } from 'react-native';

import theme from '../../theme';

interface Props {
  name?: string | null;
}

function RegionTitle({ name }: Props) {
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
