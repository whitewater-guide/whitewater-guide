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
  return <Markdown>{markdown}</Markdown>;
};

export const PlainTextScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => (
  <Screen>
    <PlainText
      fixture={navigation.getParam('fixture')}
      text={navigation.getParam('text')}
    />
  </Screen>
);

PlainTextScreen.navigationOptions = ({ navigation }) => {
  return { headerTitle: navigation.getParam('title') };
};
