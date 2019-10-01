import { fireEvent } from '@testing-library/react';
import {
  MockedProviderOptions,
  MockedResolversContext,
  RecursiveMockResolver,
} from '@whitewater-guide/clients';
import { SectionInput } from '@whitewater-guide/commons';
import { GraphQLResolveInfo } from 'graphql';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { DeepPartial } from 'utility-types';
import { FORM_SUCCEEDED, renderForm } from '../../../formik/test';
import SectionForm from './SectionForm';
import { RouterParams } from './types';

jest.mock('../../../components/maps/DrawingMap');
jest.mock('validator/lib/isUUID', () => () => true);

const mocks: RecursiveMockResolver = {
  Section: () => ({
    shape: () => [[0, 0, 0], [1, 1, 1], [2, 2, 2]],
    duration: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return seq * 10;
    },
  }),
  GaugeBinding: () => ({
    formula: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return `x + ${seq}`;
    },
  }),
  Point: () => ({
    coordinates: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq: lng } = ctx.counters.resolveNext(info);
      const { seq: lat } = ctx.counters.resolveNext(info);
      const { seq: alt } = ctx.counters.resolveNext(info);
      return [lng, lat, alt];
    },
    kind: () => 'other',
  }),
  Tag: () => ({
    id: (
      _: any,
      __: any,
      ctx: MockedResolversContext,
      info: GraphQLResolveInfo,
    ) => {
      const { seq } = ctx.counters.resolveNext(info);
      return `tag${seq}`;
    },
  }),
  JSON: () => {
    const inp: SectionInput = {
      id: null,
      name: 'Suggested',
      altNames: [],
      description: '',
      season: null,
      seasonNumeric: [],
      river: { id: 'foo', name: 'bar' },
      gauge: null,
      region: { id: 'foo', name: 'bar' },
      levels: null,
      flows: null,
      flowsText: null,
      shape: [[1, 2, 3], [4, 5, 6]],
      distance: null,
      drop: null,
      duration: null,
      difficulty: 2,
      difficultyXtra: null,
      rating: null,
      tags: [],
      pois: [],
      hidden: true,
      helpNeeded: null,
      createdBy: 'author',
      suggestionId: '__suggestion_id__',
    };
    return inp;
  },
};

describe('existing section', () => {
  const route: DeepPartial<RouteComponentProps<RouterParams>> = {
    match: { params: { regionId: 'bar', sectionId: 'foo' } },
    location: {
      search: '',
    },
  };
  const renderIt = () =>
    renderForm(<SectionForm {...(route as any)} />, {
      mocks,
      Query: { suggestedSection: () => null },
    });

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue(
      'Section.name.1',
    );
    await expect(findByText('Update')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByText } = renderIt();
    const button = await findByText('Update');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});

describe('new section', () => {
  const route: DeepPartial<RouteComponentProps<RouterParams>> = {
    match: { params: { regionId: 'bar' } },
    location: {
      search: '?riverId=foo',
    },
  };
  const options: MockedProviderOptions = {
    Query: { section: () => null, suggestedSection: () => null },
    mocks,
  };
  const renderIt = () =>
    renderForm(<SectionForm {...(route as any)} />, options);

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue('');
    await expect(findByText('Create')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByLabelText, findByText, findByTestId } = renderIt();
    const name = await findByLabelText('Name');
    const fakeMap = await findByTestId('fake_map');
    fireEvent.change(name, { target: { value: 'foo' } });
    fireEvent.click(fakeMap);
    fireEvent.click(fakeMap);
    fireEvent.click(fakeMap);
    const button = await findByText('Create');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});

describe('duplicate section', () => {
  const route: DeepPartial<RouteComponentProps<RouterParams>> = {
    match: { params: { regionId: 'bar' } },
    location: {
      search: '?copy=__copy_id__',
    },
  };
  const options: MockedProviderOptions = {
    mocks: {
      ...mocks,
      Section: (s, a, c, i) => ({
        ...mocks.Section(s, a, c, i),
        id: () => '__copy_id__',
      }),
    },
    Query: { suggestedSection: () => null },
  };
  const renderIt = () =>
    renderForm(<SectionForm {...(route as any)} />, options);

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue('');
    await expect(findByText('Create')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByLabelText, findByText } = renderIt();
    const name = await findByLabelText('Name');
    fireEvent.change(name, { target: { value: 'foo' } });
    const button = await findByText('Create');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});

describe('from suggestion', () => {
  const route: DeepPartial<RouteComponentProps<RouterParams>> = {
    match: { params: { regionId: 'bar' } },
    location: {
      search: '?fromSuggestedId=__suggestion_id__',
    },
  };
  const options: MockedProviderOptions = {
    mocks,
    Query: { section: () => null },
  };
  const renderIt = () =>
    renderForm(<SectionForm {...(route as any)} />, options);

  it('should begin in loading state', () => {
    const { getByRole, getByLabelText } = renderIt();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(() => getByLabelText('Name')).toThrow();
  });

  it('should provide initial data', async () => {
    const { findByLabelText, findByText } = renderIt();
    await expect(findByLabelText('Name')).resolves.toHaveValue('Suggested');
    await expect(findByText('Accept')).resolves.toBeTruthy();
    await expect(findByText('Reject')).resolves.toBeTruthy();
  });

  it('should submit form', async () => {
    const { findByText } = renderIt();
    const button = await findByText('Accept');
    fireEvent.click(button);
    await expect(findByText(FORM_SUCCEEDED)).resolves.toBeTruthy();
  });
});
