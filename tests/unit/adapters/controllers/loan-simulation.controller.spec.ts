import { describe, vi, it, expect } from 'vitest';

import { HTTPRequest, HTTPResponse } from '../../../../src/adapters';
import { LoanSimulationsInput } from '../../../../src/use-cases/api/loan-simulation';
import LoanSimulationController from '../../../../src/adapters/controllers/loan-simulation.controller';

const interactor = {
  execute: vi.fn()
};

const input: HTTPRequest = {
  body: {
    simulations: [
      {
        principal: 1000,
        birthDate: '2018-01,01',
        months: 12
      },
      {
        principal: 1000,
        birthDate: '2018-01,01',
        months: 12
      }
    ]
  }
};

const response: HTTPResponse = {};

const sut = new LoanSimulationController({ loanSimulationInteractor: interactor });

describe('LoanSimulationController', () => {
  it('should call interactor with correct data', async () => {
    await sut.run(input, response);

    const interactorInput: LoanSimulationsInput = {
      simulations: [
        {
          principal: 1000,
          birthDate: '2018-01,01',
          months: 12
        },
        {
          principal: 1000,
          birthDate: '2018-01,01',
          months: 12
        }
      ]
    };

    expect(interactor.execute).toBeCalledWith(interactorInput);
  });
});
