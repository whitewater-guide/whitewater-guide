import { Context } from '../apollo';
import { adminContext, anonContext } from '../test/context';
import { isAdmin } from '../ww-commons';
import { ColumnMap, getPrimitives } from './queryBuilders';

describe('getPrimitives', () => {
  const topLevelFields = ['__typename', 'camelCase', 'snake_case', 'regular', 'everyone', 'admin', 'connection'];
  const customMap: ColumnMap<any> = {
    admin: (c: Context) => isAdmin(c.user) ? 'admin' : null,
  };
  const prefix = 'tablename';

  it('should prefix fields', () => {
    const result = getPrimitives<any>(topLevelFields, prefix);
    result.forEach(field => expect(field.indexOf(prefix)).toBe(0));
  });

  it('should omit __typename', () => {
    const result = getPrimitives<any>(topLevelFields, prefix);
    expect(result).not.toContain('tablename.__typename');
  });

  it('should convert graphql camelCase to postgres snake_case', () => {
    expect(getPrimitives<any>(topLevelFields, prefix)).toContain('tablename.camel_case');
  });

  it('should not include connections', () => {
    expect(getPrimitives<any>(topLevelFields, prefix, undefined, ['connection']))
      .not.toContain('tablename.connection');
  });

  it('should conditionally omit', () => {
    const userResult = getPrimitives<any>(topLevelFields, prefix, anonContext, ['connection'], customMap);
    expect(userResult).not.toContain('tablename.admin');
    const adminResult = getPrimitives<any>(topLevelFields, prefix, adminContext, ['connection'], customMap);
    expect(adminResult).toContain('tablename.admin');
  });

  it('should match snapshot', () => {
    const userResult = getPrimitives<any>(topLevelFields, prefix, anonContext, ['connection'], customMap);
    expect(userResult).toMatchSnapshot();
  });

});
