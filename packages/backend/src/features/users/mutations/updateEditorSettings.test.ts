import { holdTransaction, rollbackTransaction } from '../../../db';
import { ADMIN, ADMIN_ID, EDITOR_GA_EC, EDITOR_GA_EC_ID } from '../../../seeds/test/01_users';
import { anonContext, fakeContext } from '../../../test/context';
import { runQuery } from '../../../test/runQuery';
import { EditorSettings } from '../../../ww-commons';

beforeEach(holdTransaction);
afterEach(rollbackTransaction);

const mutation = `
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
  const result = await runQuery(mutation, { editorSettings }, anonContext());
  expect(result).toHaveProperty('errors.0.name', 'AuthenticationRequiredError');
  expect(result).toHaveProperty('data.updateEditorSettings', null);
});

it('should fail on invalid input', async () => {
  const result = await runQuery(mutation, { editorSettings: { language: 'latin' } }, fakeContext(EDITOR_GA_EC));
  expect(result).toHaveProperty('errors.0.name', 'ValidationError');
});

it('should set settings if not exists', async () => {
  const result = await runQuery(mutation, { editorSettings }, fakeContext(ADMIN));
  expect(result).toHaveProperty('data.updateEditorSettings.id', ADMIN_ID);
  expect(result).toHaveProperty('data.updateEditorSettings.editorSettings.language', 'de');
});

it('should merge if context exists', async () => {
  const result = await runQuery(mutation, { editorSettings }, fakeContext(EDITOR_GA_EC));
  expect(result).toHaveProperty('data.updateEditorSettings.id', EDITOR_GA_EC_ID);
  expect(result).toHaveProperty('data.updateEditorSettings.editorSettings.language', 'de');
});
