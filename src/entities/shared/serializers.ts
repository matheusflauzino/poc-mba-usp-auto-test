import { Simulation } from '@entities';

export const entitySerializers = {
  simulation: (simulation: Simulation) => simulation?.getProps(),
  simulations: (simulations: Simulation[]) =>
    simulations.map((simulation) => {
      simulation.getProps();
    }),

  exception: (err: any) => {
    return {
      errTxt: JSON.stringify(err),
      errNameTxt: err?.name?.toString(),
      errMessageTxt: err?.message?.toString(),
      errStackTxt: err?.stack?.toString()
    };
  }
};
