import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert } from 'react-native';

import type { RootStackParamsList } from '../../core/navigation';
import MockButton from './MockButton';
import MockScreenWrapper from './MockScreenWrapper';

const MockDescentFormCommentScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamsList>>();

  return (
    <MockScreenWrapper>
      <MockButton
        label="Submit"
        testID="mock:submit"
        onPress={() => {
          Alert.alert('Submitted', 'Descent form submitted (mock)', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
        }}
      />
      <MockButton
        label="Back"
        testID="mock:back"
        onPress={() => navigation.goBack()}
      />
    </MockScreenWrapper>
  );
};

export default MockDescentFormCommentScreen;
