import { Coordinate3d } from '@whitewater-guide/commons';
import { Formik } from 'formik';
import HelperText from 'forms/HelperText';
import NumericField from 'forms/NumericField';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Surface } from 'react-native-paper';
import theme from '../../../../../theme';
import { Shape } from '../../types';
import { getShapeError, isShapeTouched } from '../../utils';
import { PiToState } from '../usePiToState';
import PiToPointHeader from './PiToPointHeader';
import { schema, validator } from './validation';

const styles = StyleSheet.create({
  kav: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dialog: {
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
});

interface Props {
  initialShape: PiToState['shape'];
  setShape: (shape: [Coordinate3d, Coordinate3d]) => void;
  onDismiss: () => void;
}

export const PiToDialog: React.FC<Props> = (props) => {
  const { initialShape, setShape, onDismiss } = props;
  const { t } = useTranslation();
  const initialValues = useMemo(
    () => ({
      shape: initialShape,
    }),
    [initialShape],
  );
  const initialErrors = useMemo(() => validator(initialValues) || {}, [
    initialValues,
  ]);
  const onSubmit = useCallback(
    (values: Shape) => {
      setShape(schema.cast(values).shape as any);
      onDismiss();
    },
    [setShape, onDismiss],
  );
  return (
    <Portal>
      <Formik<Shape>
        initialValues={initialValues}
        initialErrors={initialErrors}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ submitForm, isValid, touched, errors, setFieldValue }) => (
          <Modal
            visible={true}
            onDismiss={onDismiss}
            contentContainerStyle={StyleSheet.absoluteFill}
          >
            <KeyboardAvoidingView
              behavior="height"
              style={styles.kav}
              pointerEvents="box-none"
            >
              <Surface style={styles.dialog}>
                <PiToPointHeader index={0} setFieldValue={setFieldValue} />
                <View style={styles.row} accessibilityHint={t('commons:putIn')}>
                  <NumericField
                    name="shape.0.1"
                    label={t('commons:latitude')}
                    keyboardType="numeric"
                    maxLength={7}
                    wrapperStyle={styles.inputLat}
                    displayError={false}
                  />
                  <NumericField
                    name="shape.0.0"
                    label={t('commons:longitude')}
                    keyboardType="numeric"
                    maxLength={8}
                    wrapperStyle={styles.inputLng}
                    displayError={false}
                  />
                  <NumericField
                    name="shape.0.2"
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
                <View
                  style={styles.row}
                  accessibilityHint={t('commons:takeOut')}
                >
                  <NumericField
                    name="shape.1.1"
                    label={t('commons:latitude')}
                    keyboardType="numeric"
                    maxLength={8}
                    wrapperStyle={styles.inputLat}
                    displayError={false}
                  />
                  <NumericField
                    name="shape.1.0"
                    label={t('commons:longitude')}
                    keyboardType="numeric"
                    maxLength={7}
                    wrapperStyle={styles.inputLng}
                    displayError={false}
                  />
                  <NumericField
                    name="shape.1.2"
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
                  >
                    {t('commons:ok')}
                  </Button>
                </View>
              </Surface>
            </KeyboardAvoidingView>
          </Modal>
        )}
      </Formik>
    </Portal>
  );
};

PiToDialog.displayName = 'PiToDialog';
