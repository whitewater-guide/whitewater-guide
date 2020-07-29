import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import KeyboardSpacer from '~/components/keyboard-spacer';
import CheckboxField from '~/forms/CheckboxField';
import TextField from '~/forms/TextField';
import theme from '~/theme';
import { DescentFormData } from '../types';

const styles = StyleSheet.create({
  container: {
    padding: theme.margin.single,
    flex: 1,
  },
  descriptionWrapper: {
    flex: 1,
  },
  description: {
    marginBottom: 24,
  },
});

const DescentFormCommentView: React.FC = () => {
  const { t } = useTranslation();
  const { isSubmitting, submitForm, values } = useFormikContext<
    DescentFormData
  >();
  return (
    <View style={styles.container}>
      <TextField
        name="comment"
        autoFocus={true}
        multiline={true}
        wrapperStyle={styles.descriptionWrapper}
        label={t('screens:descentForm.comment.commentLabel')}
        placeholder={t('screens:descentForm.comment.commentPlaceholder')}
        fullHeight={true}
      />
      <CheckboxField
        name="public"
        label={t('screens:descentForm.comment.publicLabel')}
      />
      <Button
        mode="contained"
        onPress={isSubmitting ? undefined : submitForm}
        loading={isSubmitting}
      >
        {t(
          values.id
            ? 'screens:descentForm.updateButton'
            : 'screens:descentForm.createButton',
        )}
      </Button>
      <KeyboardSpacer />
    </View>
  );
};

export default DescentFormCommentView;
