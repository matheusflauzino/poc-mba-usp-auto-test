import { describe, expect, it } from 'vitest';
import { Simulation, SimulationProps } from '../../../src/entities';
import { makeSimulationEntityProps } from '../mocks/entities';

describe('Simulation', () => {
  it('should build a Simulation with valid data and calculate results in cents', () => {
    const props = makeSimulationEntityProps({
      principal: 100000, // R$1000,00 em centavos
      annualInterestRate: 5, // 5% ao ano
      months: 12, // 12 meses
    });

    const entity = Simulation.build(props);

    expect(entity.succeeded).toBeTruthy();

    const simulation = entity.value;

    // Verifica os valores calculados
    const result = simulation.result;
    expect(result).toHaveProperty('monthlyPayment');
    expect(result).toHaveProperty('totalInterest');
    expect(result).toHaveProperty('totalPayment');

    // Verifica que os valores estão em centavos
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPayment).toBe(props.principal + result.totalInterest);

    // Verifica as propriedades principais
    expect(simulation.getProps()).toEqual(expect.objectContaining(props));
    expect(simulation.identifier).toBeDefined();
    expect(simulation.ttl).toBeGreaterThan(0);
  });

  it('should build a Simulation and auto-generate identifier and ttl if not provided', () => {
    const props = makeSimulationEntityProps({
      principal: 500000, // R$5000,00 em centavos
      annualInterestRate: 3, // 3% ao ano
      months: 24, // 24 meses
      identifier: undefined, // Não fornece um identificador
      ttl: undefined, // Não fornece TTL
    });

    const entity = Simulation.build(props);

    expect(entity.succeeded).toBeTruthy();

    const simulation = entity.value;

    // Verifica que o identifier foi gerado automaticamente
    expect(simulation.identifier).toBeDefined();
    expect(simulation.identifier).not.toBeNull();

    // Verifica que o TTL foi gerado automaticamente
    expect(simulation.ttl).toBeGreaterThan(0);
  });

  it('should fail to build a Simulation with missing properties', () => {
    const props = makeSimulationEntityProps({
      principal: null, // Faltando o valor do principal
      annualInterestRate: 5,
      months: 12,
    });

    const entity = Simulation.build(props);

    expect(entity.succeeded).toBeFalsy();

    // Verifica os erros retornados
    const errors = entity.errors;
    expect(errors).toBeDefined();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toBe('Missing property principal');
  });

  it('should calculate results accurately for a simulation', () => {
    const props = makeSimulationEntityProps({
      principal: 150000, // R$1500,00 em centavos
      annualInterestRate: 4, // 4% ao ano
      months: 6, // 6 meses
    });

    const entity = Simulation.build(props);

    expect(entity.succeeded).toBeTruthy();

    const result = entity.value.result;

    // Verifica os cálculos em centavos
    expect(result.monthlyPayment).toBeGreaterThan(0); // Valor da parcela mensal
    expect(result.totalInterest).toBeGreaterThan(0); // Total de juros
    expect(result.totalPayment).toBe(result.monthlyPayment * props.months); // Verifica o total
  });

  it('should calculate results accurately for various cases', () => {
    const testCases = [
      {
        props: { principal: 100000, annualInterestRate: 5, months: 12 },
        expected: {
          monthlyPayment: 8557,
          totalInterest: 2684,
          totalPayment: 102684,
        },
      },
      {
        props: { principal: 100000, annualInterestRate: 3, months: 12 },
        expected: {
          monthlyPayment: 8469,
          totalInterest: 1628,
          totalPayment: 101628,
        },
      },
      {
        props: { principal: 100000, annualInterestRate: 2, months: 12 },
        expected: {
          monthlyPayment: 8420,
          totalInterest: 1040,
          totalPayment: 101040,
        },
      },
      {
        props: { principal: 100000, annualInterestRate: 4, months: 12 },
        expected: {
          monthlyPayment: 8513,
          totalInterest: 2156,
          totalPayment: 102156,
        },
      }
    ];

    testCases.forEach(({ props, expected }) => {
      const entity = Simulation.build(props);

      expect(entity.succeeded).toBeTruthy();

      const result = entity.value.result;

      // Verifica os cálculos exatos em centavos
      expect(result.monthlyPayment).toBe(expected.monthlyPayment);
      expect(result.totalInterest).toBe(expected.totalInterest);
      expect(result.totalPayment).toBe(expected.totalPayment);
    });



    testCases.forEach(({ props, expected }) => {
      const entity = Simulation.build(props);

      expect(entity.succeeded).toBeTruthy();

      const result = entity.value.result;

      // Verifica os cálculos exatos em centavos
      expect(result.monthlyPayment).toBe(expected.monthlyPayment);
      expect(result.totalInterest).toBe(expected.totalInterest);
      expect(result.totalPayment).toBe(expected.totalPayment);
    });
  });

});
