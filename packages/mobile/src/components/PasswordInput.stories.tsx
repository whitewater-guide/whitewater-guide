import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PasswordInput } from './PasswordInput';

type Props = React.ComponentProps<typeof PasswordInput>;

const StatefulInput: React.FC<Props> = (props) => {
  const [value, setValue] = useState();
  return <PasswordInput {...props} value={value} onChangeText={setValue} />;
};

storiesOf('PasswordInput', module)
  .addDecorator((story: any) => (
    <View style={{ ...StyleSheet.absoluteFillObject, padding: 8 }}>
      {story()}
    </View>
  ))
  .add('Default', () => <StatefulInput label="Password" mode="outlined" />)
  .add('With strength indicator', () => (
    <StatefulInput
      label="Password"
      mode="outlined"
      showStrengthIndicator={true}
    />
  ));
