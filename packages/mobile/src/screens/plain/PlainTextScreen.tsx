import React from 'react';
import { WithNamespaces, withNamespaces } from 'react-i18next';
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

export const PlainText: React.StatelessComponent<Props & WithNamespaces> = ({
  text,
  fixture,
  t,
}) => {
  const markdown = text || (fixture ? t(fixture) : 'Text not found');
  return (
    <Screen>
      <Markdown>{markdown}</Markdown>
    </Screen>
  );
};

const PlainTextWithT = withNamespaces('markdown')(PlainText);

export const PlainTextScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => (
  <PlainTextWithT
    fixture={navigation.getParam('fixture')}
    text={navigation.getParam('text')}
  />
);

PlainTextScreen.navigationOptions = ({ navigation }) => {
  return { headerTitle: navigation.getParam('title') };
};
