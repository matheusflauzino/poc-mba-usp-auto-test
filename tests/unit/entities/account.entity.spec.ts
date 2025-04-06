import { describe, expect, it } from 'vitest';
import { Account } from '../../../src/entities';

describe('Account', () => {
  const makeAccountProps = (props: any = {}) => ({
    name: 'John Doe',
    email: 'john@example.com',
    document: '123.456.789-00',
    balance: 100000, // R$1000,00 em centavos
    ...props,
  });

  it('should build an Account with valid data', () => {
    const props = makeAccountProps();
    const entity = Account.build(props);

    expect(entity.succeeded).toBeTruthy();

    const account = entity.value;

    // Verifica as propriedades principais
    expect(account.getProps()).toEqual(expect.objectContaining(props));
    expect(account.identifier).toBeDefined();
  });

  it('should build an Account and auto-generate identifier if not provided', () => {
    const props = makeAccountProps({
      identifier: undefined,
    });

    const entity = Account.build(props);

    expect(entity.succeeded).toBeTruthy();

    const account = entity.value;

    // Verifica que o identifier foi gerado automaticamente
    expect(account.identifier).toBeDefined();
    expect(account.identifier).not.toBeNull();
  });

  it('should fail to build an Account with missing name', () => {
    const props = makeAccountProps({
      name: '',
    });

    const entity = Account.build(props);

    expect(entity.succeeded).toBeFalsy();

    const errors = entity.errors;
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe('Missing property name');
  });

  it('should fail to build an Account with missing email', () => {
    const props = makeAccountProps({
      email: '',
    });

    const entity = Account.build(props);

    expect(entity.succeeded).toBeFalsy();

    const errors = entity.errors;
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe('Missing property email');
  });

  it('should fail to build an Account with missing document', () => {
    const props = makeAccountProps({
      document: '',
    });

    const entity = Account.build(props);

    expect(entity.succeeded).toBeFalsy();

    const errors = entity.errors;
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe('Missing property document');
  });

  it('should fail to build an Account with missing balance', () => {
    const props = makeAccountProps({
      balance: undefined,
    });

    const entity = Account.build(props);

    expect(entity.succeeded).toBeFalsy();

    const errors = entity.errors;
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe('Missing property balance');
  });
});
