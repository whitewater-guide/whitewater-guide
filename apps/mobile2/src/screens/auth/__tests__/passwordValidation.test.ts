import { PASSWORD_MIN_SCORE } from '@whitewater-guide/commons';

import getRegisterSchema from '../register/getValidationSchema';
import getResetSchema from '../reset/getValidationSchema';

describe('password strength validation', () => {
  describe('register schema', () => {
    const schema = getRegisterSchema();

    it('should reject weak passwords', async () => {
      await expect(
        schema.validate({
          email: 'test@test.com',
          name: 'Test',
          password: '123456',
        }),
      ).rejects.toThrow();
    });

    it('should accept strong passwords', async () => {
      await expect(
        schema.validate({
          email: 'test@test.com',
          name: 'Test',
          password: 'C0mpl3x!Pass#2024',
        }),
      ).resolves.toBeDefined();
    });
  });

  describe('reset schema', () => {
    const schema = getResetSchema();

    it('should reject weak passwords', async () => {
      await expect(
        schema.validate({
          id: 'some-id',
          token: 'some-token',
          password: 'password',
        }),
      ).rejects.toThrow();
    });

    it('should accept strong passwords', async () => {
      await expect(
        schema.validate({
          id: 'some-id',
          token: 'some-token',
          password: 'C0mpl3x!Pass#2024',
        }),
      ).resolves.toBeDefined();
    });
  });

  it('should have PASSWORD_MIN_SCORE of 2', () => {
    expect(PASSWORD_MIN_SCORE).toBe(2);
  });
});
