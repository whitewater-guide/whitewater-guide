import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { mockApolloProvider } from '../../test';
import { SectionProvider, useSection } from './SectionProvider';

it('useSection should return section', async () => {
  const Provider = mockApolloProvider();
  const wrapper: React.FC = ({ children }) => (
    <Provider>
      <SectionProvider sectionId="foo" returnPartialData={true}>
        {children}
      </SectionProvider>
    </Provider>
  );
  const { result, waitForNextUpdate } = renderHook(() => useSection(), {
    wrapper,
  });
  expect(result.current.loading).toBe(true);
  await waitForNextUpdate();
  expect(result.current.node!.name).toBe('Section.name.1');
});
