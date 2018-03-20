// tslint:disable:max-classes-per-file
import casual from 'casual';
import React from 'react';
import renderer from 'react-test-renderer';
import { createMockedProvider } from '../../test';
import { withSection, WithSection } from './withSection';

const MockedProvider = createMockedProvider();

beforeEach(() => casual.seed(1));

it('has a loading state', done => {
  class Container extends React.PureComponent<WithSection> {
    // tslint:disable-next-line:no-inferrable-types
    ticks: number = 0;

    componentWillMount() {
      expect(this.props.section.loading).toBe(true);
    }
    componentWillReceiveProps(next: WithSection) {
      // This is weird cache-and network behavior, takes 2 ticks to set loading to false
      expect(next.section.loading).toBe(!this.ticks);
      if (this.ticks) {
        done();
      }
      this.ticks += 1;
    }
    render() {
      return null;
    }
  }

  const ContainerWithData = withSection()(Container);
  renderer.create(
    <MockedProvider>
      <ContainerWithData sectionId="2b01742c-d443-11e7-9296-cec278b6b50a" />
      </MockedProvider>);
});

it('should match snapshot', done => {
  class Container extends React.PureComponent<WithSection> {
    // tslint:disable-next-line:no-inferrable-types
    ticks: number = 0;

    componentWillReceiveProps(next: WithSection) {
      this.ticks += 1;
      if (this.ticks === 2) {
        expect(next).toMatchSnapshot();
        done();
      }
    }

    render() {
      return null;
    }
  }

  const ContainerWithData = withSection()(Container);
  renderer.create(
    <MockedProvider>
      <ContainerWithData sectionId="2b01742c-d443-11e7-9296-cec278b6b50a" />
      </MockedProvider>);
});
