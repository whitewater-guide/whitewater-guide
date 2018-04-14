// tslint:disable:max-classes-per-file
import { Component, PureComponent } from 'react';
import { NavigationScreenConfig, NavigationScreenProps } from 'react-navigation';

export class PureScreen<Props = {}, Params = {}, State = {}> extends
  PureComponent<Props & NavigationScreenProps<Params, any>, State> {
  static navigationOptions?: NavigationScreenConfig<{}>;
}

export class Screen<Props = {}, Params = {}, State = {}> extends
  Component<Props & NavigationScreenProps<Params>, State> {
  static navigationOptions?: NavigationScreenConfig<{}>;
}
