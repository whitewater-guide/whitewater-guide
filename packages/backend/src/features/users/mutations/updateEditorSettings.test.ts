import { ApolloErrorCodes } from '@whitewater-guide/commons';
import type { EditorSettings } from '@whitewater-guide/schema';
import { gql } from 'graphql-tag';

import { holdTransaction, rollbackTransaction } from '../../../db/index';
import {
  ADMIN,
  ADMIN_ID,
  EDITOR_GA_EC,
  EDITOR_GA_EC_ID,
} from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/index';
import { testUpdateEditorSettings } from './updateEditorSettings.test.generated';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const _mutation = gql`
  mutation updateEditorSettings($editorSettings: EditorSettingsInput!) {
    updateEditorSettings(editorSettings: $editorSettings) {
      id
      editorSettings {
        language
      }
    }
  }
`;

const editorSettings: EditorSettings = { language: 'de' };

it('anons cannot do that', async () => {
  const result = await testUpdateEditorSettings(
    { editorSettings },
    anonContext(),
  );
  expect(result).toHaveGraphqlError(ApolloErrorCodes.UNAUTHENTICATED);
});

it('should fail on invalid input', async () => {
  const result = await testUpdateEditorSettings(
    { editorSettings: { language: 'latin' } },
    fakeContext(EDITOR_GA_EC),
  );
  expect(result).toHaveGraphqlValidationError();
});

it('should set settings if not exists', async () => {
  const result = await testUpdateEditorSettings(
    { editorSettings },
    fakeContext(ADMIN),
  );
  expect(result).toHaveProperty('data.updateEditorSettings.id', ADMIN_ID);
  expect(result).toHaveProperty(
    'data.updateEditorSettings.editorSettings.language',
    'de',
  );
});

it('should merge if context exists', async () => {
  const result = await testUpdateEditorSettings(
    { editorSettings },
    fakeContext(EDITOR_GA_EC),
  );
  expect(result).toHaveProperty(
    'data.updateEditorSettings.id',
    EDITOR_GA_EC_ID,
  );
  expect(result).toHaveProperty(
    'data.updateEditorSettings.editorSettings.language',
    'de',
  );
});
