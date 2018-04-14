import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Markdown, Screen } from '../../components';
import I18n from '../../i18n';

interface NavParams {
  fixture?: string;
  title?: string;
}

interface Props {
  fixture?: string;
  text?: string;
}

export const PlainText: React.StatelessComponent<Props> = ({ text, fixture }) => (
  <Screen>
    <Markdown>
      {
        text ?
          text :
          I18n.t(`markdown.${fixture}`)
      }
    </Markdown>
  </Screen>
);

export const PlainTextScreen: NavigationScreenComponent<NavParams> = ({ navigation }) => (
  <PlainText fixture={navigation.getParam('fixture')} />
);

PlainTextScreen.navigationOptions = ({ navigation }) => {
  return { title: navigation.getParam('title') };
};
