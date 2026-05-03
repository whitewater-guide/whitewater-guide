import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import Screen from '../../../components/Screen';
import TextField from '../../../forms/TextField';

const styles = StyleSheet.create({
  avoider: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
  },
});

function DescriptionScreen() {
  const { t } = useTranslation();
  return (
    <Screen padding>
      <KeyboardAvoidingView style={styles.avoider} behavior="padding">
        <TextField
          name="description"
          multiline
          label={t('screens:addSection.description.label')}
          testID="description"
          displayError={false}
          wrapperStyle={styles.wrapper}
          style={styles.input}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

export default DescriptionScreen;
