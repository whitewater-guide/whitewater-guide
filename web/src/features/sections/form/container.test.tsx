import * as casual from 'casual';
import { ReactWrapper } from 'enzyme';
import * as React from 'react';
import { InjectedFormProps } from 'redux-form';
import { FormReceiver, mountForm } from '../../../test';
import { flushPromises } from '../../../ww-clients/test';
import { SectionInput } from '../../../ww-commons';
import sectionForm from './container';

let wrapped: ReactWrapper;
let receiver: ReactWrapper<InjectedFormProps<SectionInput>>;

beforeEach(async () => {
  casual.seed(1);
});

afterEach(() => {
  wrapped.unmount();
});

const mountWithOptions = (sectionId?: string) => {
  const queries = sectionId ? undefined : { section: () => null };
  wrapped = mountForm({ form: sectionForm, props: { sectionId, sourceId: 'lol' }, mockApollo: true, queries });
};

it('should match snapshot for new section', async () => {
  mountWithOptions();
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should match snapshot for existing section', async () => {
  mountWithOptions('foo');
  await flushPromises();
  wrapped.update();
  receiver = wrapped.find(FormReceiver).first() as any;
  expect(receiver.prop('initialValues')).toMatchSnapshot();
});

it('should have region with bounds and gauges', () => {
  throw new Error();
});

it('should have river to display river name in new section form', () => {
  throw new Error();
});

it('should have tags to select from', () => {
  throw new Error();
});
