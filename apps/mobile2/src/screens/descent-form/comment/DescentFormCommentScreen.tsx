import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Button } from 'react-native-paper';

import Screen from '../../../components/Screen';
import type { RootStackParamsList, Screens } from '../../../core/navigation';
import CheckboxField from '../../../forms/CheckboxField';
import TextField from '../../../forms/TextField';
import theme from '../../../theme';
import { useDescentFormDraft } from '../DescentFormDraftContext';
import type { DescentFormData } from '../types';
import useUpsertDescent from '../useUpsertDescent';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  typeof Screens.DESCENT_FORM_COMMENT
>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.margin.single,
  },
  avoider: {
    flex: 1,
  },
  commentWrapper: {
    flex: 1,
  },
  commentInput: {
    flex: 1,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: theme.margin.single,
  },
});

type CommentValues = Pick<DescentFormData, 'comment' | 'public'>;

function DescentFormCommentScreen(_props: Props) {
  const { t } = useTranslation();
  const { draft } = useDescentFormDraft();
  const upsert = useUpsertDescent();

  const initialValues = useMemo<CommentValues>(
    () => ({
      comment: draft.comment ?? undefined,
      public: draft.public ?? true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onSubmit = useCallback(
    async (values: CommentValues) => {
      const fullDraft = { ...draft, ...values };
      if (!fullDraft.section || !fullDraft.startedAt) {
        return;
      }
      await upsert(fullDraft as DescentFormData);
    },
    [draft, upsert],
  );

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, submitForm }) => (
        <KeyboardAvoidingView style={styles.avoider} behavior="padding">
          <Screen safeBottom style={styles.container}>
            <TextField
              name="comment"
              multiline
              displayError={false}
              label={t('screens:descentForm.comment.commentLabel')}
              wrapperStyle={styles.commentWrapper}
              style={styles.commentInput}
            />
            <CheckboxField
              name="public"
              label={t('screens:descentForm.comment.publicLabel')}
            />
            <Button
              mode="contained"
              onPress={isSubmitting ? undefined : submitForm}
              loading={isSubmitting}
              style={styles.submit}
            >
              {t(
                draft.id
                  ? 'screens:descentForm.updateButton'
                  : 'screens:descentForm.createButton',
              )}
            </Button>
          </Screen>
        </KeyboardAvoidingView>
      )}
    </Formik>
  );
}

export default DescentFormCommentScreen;
