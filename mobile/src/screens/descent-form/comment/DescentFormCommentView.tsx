import { useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import FullScreenKAV from '~/components/FullScreenKAV';
import CheckboxField from '~/forms/CheckboxField';
import TextField from '~/forms/TextField';
import theme from '~/theme';

import { DescentFormData } from '../types';

const styles = StyleSheet.create({
  container: {
    padding: theme.margin.single,
  },
});

const DescentFormCommentView: React.FC = () => {
  const { t } = useTranslation();
  const { isSubmitting, submitForm, values } = useFormikContext<
    DescentFormData
  >();
  return (
    <FullScreenKAV contentStyle={styles.container}>
      <TextField
        name="comment"
        autoFocus={
          Platform.OS ===
          'android' /* Due to keyboard avoiding view inconsistent behavior */
        }
        multiline={true}
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
    </FullScreenKAV>
  );
};

export default DescentFormCommentView;
