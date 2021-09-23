import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { mockApolloProvider } from '../../test';
import { SectionProvider, useSectionQuery } from './SectionProvider';

it('useSection should return section', async () => {
  const Provider = mockApolloProvider();
  const wrapper: React.FC = ({ children }) => (
    <Provider>
      <SectionProvider sectionId="foo">{children}</SectionProvider>
    </Provider>
  );
  const { result, waitFor } = renderHook(() => useSectionQuery(), {
    wrapper,
  });
  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.data?.section?.name).toBe('Section.name.1');
  });
});
