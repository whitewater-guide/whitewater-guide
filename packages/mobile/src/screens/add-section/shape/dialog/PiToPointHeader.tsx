import { FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import theme from '../../../../theme';
import useClipboardCoordinate from './useClipboardCoordinate';

const styles = StyleSheet.create({
  container: {
    height: theme.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    textTransform: 'uppercase',
  },
});

interface Props {
  index: 0 | 1;
  setFieldValue: FormikHelpers<any>['setFieldValue'];
}

const PiToPointHeader: React.FC<Props> = (props) => {
  const { index, setFieldValue } = props;
  const { t } = useTranslation();
  const clipboard = useClipboardCoordinate();
  const handlers = useMemo(
    () => ({
      onClear: () =>
        setFieldValue(`shape.${index}`, [undefined, undefined, undefined]),
      onPaste: () => {
        if (clipboard) {
          setFieldValue(`shape.${index}`, clipboard);
        }
      },
    }),
    [setFieldValue, index, clipboard],
  );
  return (
    <View style={styles.container}>
      <Subheading style={styles.label}>
        {t(index ? 'commons:takeOut' : 'commons:putIn')}
      </Subheading>
      <Button onPress={handlers.onClear}>{t('commons:clear')}</Button>
      <Button onPress={handlers.onPaste} disabled={!clipboard}>
        {t('commons:paste')}
      </Button>
    </View>
  );
};

PiToPointHeader.displayName = 'PiToPointHeader';

export default PiToPointHeader;
