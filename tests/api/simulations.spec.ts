import { describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';

import Requester from './setup';

const requester = Requester.getInstance();

describe('Simulations routes', () => {


  describe('POST simulations/loan', () => {
    describe('error handling', () => {
      it('should return 400 when parameter simulations is undefined', async () => {
        const response = await requester.fetch({
          path: '/simulations/loan',
          body: { situations: undefined },
          method: 'POST'
        });

        expect(response.status).toBe(400);
      });

    });

    describe('success cases', () => {
      it('should return 200 status code and success message', async () => {
        const response = await requester.fetch({
          path: '/simulations/loan',
          body: {
            simulations: [
              {
                principal: 1000.00,
                birthDate: "1950-02-22",
                months: 12
              }
            ]
          },
          method: 'POST'
        });

        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({
          simulations: [
            {
              monthlyPayment: 85.13,
              totalInterest: 21.56,
              totalPayment: 1021.56
            }
          ]
        });
      });
    });
  });


});
