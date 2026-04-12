import Clipboard from '@react-native-clipboard/clipboard';
import { arrayToLatLngString } from '@whitewater-guide/clients';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import Icon from '../../../components/Icon';
import { Row } from '../../../components/Row';
import { showSnackbar } from '../../../components/snackbar';
import theme from '../../../theme';

const styles = StyleSheet.create({
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.margin.half,
  },
  coord: {
    color: theme.colors.textNote,
  },
});

interface CoordRowProps {
  label: string;
  coordinates: CodegenCoordinates;
}

function CoordRow({ label, coordinates }: CoordRowProps) {
  const { t } = useTranslation();
  const prettyCoord = arrayToLatLngString(coordinates);

  const onCopy = useCallback(() => {
    Clipboard.setString(prettyCoord);
    showSnackbar(t('commons:copied'));
  }, [prettyCoord, t]);

  return (
    <Row>
      <Text variant="titleSmall">{label}</Text>
      <View style={styles.right}>
        <Text variant="bodySmall" style={styles.coord}>
          {prettyCoord}
        </Text>
        <Icon
          icon="content-copy"
          size={20}
          accessibilityLabel={t('commons:copy')}
          onPress={onCopy}
        />
      </View>
    </Row>
  );
}

interface Props {
  putIn?: CodegenCoordinates | null;
  takeOut?: CodegenCoordinates | null;
}

function CoordinatesInfo({ putIn, takeOut }: Props) {
  const { t } = useTranslation();

  if (!putIn && !takeOut) {
    return null;
  }

  return (
    <View>
      {!!putIn && <CoordRow label={t('commons:putIn')} coordinates={putIn} />}
      {!!takeOut && (
        <CoordRow label={t('commons:takeOut')} coordinates={takeOut} />
      )}
    </View>
  );
}

export default CoordinatesInfo;
