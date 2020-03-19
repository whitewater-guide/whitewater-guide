import { FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Modal, Surface } from 'react-native-paper';
import HelperText from '~/forms/HelperText';
import NumericField from '~/forms/NumericField';
import theme from '../../../../../theme';
import { Shape } from '../../types';
import { getShapeError, isShapeTouched } from '../../utils';
import PiToPointHeader from './PiToPointHeader';

const styles = StyleSheet.create({
  kav: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dialog: {
    width: theme.screenWidth * 0.8,
    backgroundColor: theme.colors.primaryBackground,
    borderRadius: theme.rounding.single,
    paddingBottom: theme.margin.single,
    paddingHorizontal: theme.margin.single,
    marginBottom: Platform.OS === 'android' ? 44 : 0,
    marginTop: Platform.OS === 'android' ? 44 : 24,
    marginHorizontal: theme.screenWidth <= 320 ? 12 : 24,
    elevation: 24,
    justifyContent: 'flex-start',
  },
  inputLng: {
    flex: 1,
    marginLeft: theme.margin.half,
  },
  inputLat: {
    flex: 1,
    marginRight: theme.margin.half,
  },
  inputAlt: {
    flex: 1,
    marginLeft: theme.margin.single,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  okButton: {
    minWidth: 80,
    marginLeft: theme.margin.single,
  },
  modalContent: {
    height: theme.screenHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props extends FormikProps<Shape> {
  onDismiss: () => void;
}

const PiToDialogContent: React.FC<Props> = React.memo((props) => {
  const {
    submitForm,
    isValid,
    touched,
    errors,
    values,
    setFieldValue,
    onDismiss,
  } = props;
  const { t } = useTranslation();
  return (
    <Modal
      visible={true}
      onDismiss={onDismiss}
      contentContainerStyle={StyleSheet.absoluteFill}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.modalContent}
        keyboardShouldPersistTaps="always"
      >
        <Surface style={styles.dialog}>
          <PiToPointHeader index={0} setFieldValue={setFieldValue} />
          <View style={styles.row} accessibilityHint={t('commons:putIn')}>
            <NumericField
              name="shape.0.1"
              testID="shape_0_1"
              label={t('commons:latitude')}
              keyboardType="numeric"
              maxLength={7}
              wrapperStyle={styles.inputLat}
              displayError={false}
            />
            <NumericField
              name="shape.0.0"
              testID="shape_0_0"
              label={t('commons:longitude')}
              keyboardType="numeric"
              maxLength={8}
              wrapperStyle={styles.inputLng}
              displayError={false}
            />
            <NumericField
              name="shape.0.2"
              testID="shape_0_2"
              label={t('commons:altitude')}
              keyboardType="numeric"
              maxLength={4}
              wrapperStyle={styles.inputAlt}
              displayError={false}
            />
          </View>
          <HelperText
            touched={isShapeTouched(touched, 0)}
            error={getShapeError(errors, 0)}
          />
          <PiToPointHeader index={1} setFieldValue={setFieldValue} />
          <View style={styles.row} accessibilityHint={t('commons:takeOut')}>
            <NumericField
              name="shape.1.1"
              testID="shape_1_1"
              label={t('commons:latitude')}
              keyboardType="numeric"
              maxLength={8}
              wrapperStyle={styles.inputLat}
              displayError={false}
            />
            <NumericField
              name="shape.1.0"
              testID="shape_1_0"
              label={t('commons:longitude')}
              keyboardType="numeric"
              maxLength={7}
              wrapperStyle={styles.inputLng}
              displayError={false}
            />
            <NumericField
              name="shape.1.2"
              testID="shape_1_2"
              label={t('commons:altitude')}
              keyboardType="numeric"
              maxLength={4}
              wrapperStyle={styles.inputAlt}
              displayError={false}
            />
          </View>
          <HelperText
            touched={isShapeTouched(touched, 1)}
            error={getShapeError(errors, 1)}
          />
          <View style={styles.actions}>
            <Button
              onPress={onDismiss}
              accessibilityLabel={t('commons:cancel')}
            >
              {t('commons:cancel')}
            </Button>
            <Button
              onPress={submitForm}
              disabled={!isValid}
              mode="contained"
              style={styles.okButton}
              accessibilityLabel={t('commons:ok')}
              testID="shape-submit"
            >
              {t('commons:ok')}
            </Button>
          </View>
        </Surface>
      </KeyboardAwareScrollView>
    </Modal>
  );
});

PiToDialogContent.displayName = 'PiToDialogContent';

export default PiToDialogContent;
