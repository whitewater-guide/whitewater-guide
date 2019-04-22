import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigationScreenComponent } from 'react-navigation';
import { Markdown, Screen } from '../../components';

interface NavParams {
  fixture?: string;
  title?: string;
  text?: string;
}

interface Props {
  fixture?: string;
  text?: string;
}

export const PlainText: React.FC<Props> = ({ text, fixture }) => {
  const [t] = useTranslation('markdown');
  const markdown = text || (fixture ? t(fixture) : 'Text not found');
  return (
    <Screen>
      <Markdown>{markdown}</Markdown>
    </Screen>
  );
};

export const PlainTextScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => (
  <PlainText
    fixture={navigation.getParam('fixture')}
    text={navigation.getParam('text')}
  />
);

PlainTextScreen.navigationOptions = ({ navigation }) => {
  return { headerTitle: navigation.getParam('title') };
};
