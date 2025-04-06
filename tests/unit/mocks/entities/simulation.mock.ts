import { Simulation, SimulationProps } from '../../../../src/entities';

export const makeSimulationEntityProps = (overrides: Partial<SimulationProps> = {}): SimulationProps => ({
  principal: 100000, // R$1000,00 em centavos
  annualInterestRate: 5, // 5% ao ano
  months: 12, // 12 meses
  identifier: 'test-identifier',
  ttl: Math.floor(Date.now() / 1000) + 3600, // 1 hora a partir de agora
  ...overrides,
});

export const makeSimulationEntity = (data?: Partial<SimulationProps>) => {
  const cache = Simulation.build(makeSimulationEntityProps(data));

  return cache.value;
};


