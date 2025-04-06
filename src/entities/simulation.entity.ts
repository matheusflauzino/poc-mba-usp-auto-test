import { Entity, Result } from '@entities';
import { Constants, Errors, Utils } from '@shared';

export interface SimulationProps {
  identifier?: string;
  principal: number;
  annualInterestRate: number;
  months: number;
  result?: any;
  ttl?: number;
}

export class Simulation extends Entity<SimulationProps> {
  private constructor(props: SimulationProps) {
    super(props);
  }

  public static build(props: SimulationProps): Result<Simulation> {
    const errors: Array<Error> = [];

    if (!props.principal) {
      errors.push(new Errors.UnprocessableEntityError('Missing property principal'));
    }

    if (!props.annualInterestRate) {
      errors.push(new Errors.UnprocessableEntityError('Missing property annualInterestRate'));
    }

    if (!props.months) {
      errors.push(new Errors.UnprocessableEntityError('Missing property months'));
    }

    if (errors.length > 0) {
      return Result.fail<Simulation>(errors);
    }

    if (!props.ttl) {
      props.ttl = Utils.generateExp(Constants.Time.OneHourInSeconds);
    }

    if (!props.identifier) {
      props.identifier = Utils.generateUUID();
    }

    // Cálculo do pagamento mensal
    const calculateMonthlyPayment = (): number => {
      const annualRate = Math.round(props.annualInterestRate * 100); // Taxa anual em base inteira
      const monthlyRate = Math.floor(annualRate / 12); // Taxa mensal em base inteira
      const numerator = props.principal * monthlyRate;
      const denominator = 10000 * (1 - Math.pow(1 + monthlyRate / 10000, -props.months)); // Base de 10000 para evitar decimais
      return Math.floor(numerator / denominator);
    };

    // Cálculo do total de juros
    const calculateTotalInterest = (): number => {
      const totalPaid = calculateMonthlyPayment() * props.months; // Total pago em centavos
      return totalPaid - props.principal; // Total de juros em centavos
    };

    // Geração do resultado da simulação
    const generateOutput = (): any => {
      const monthlyPayment = calculateMonthlyPayment();
      const totalInterest = calculateTotalInterest();
      const totalPayment = monthlyPayment * props.months;

      return {
        monthlyPayment, // Parcelas mensais em centavos
        totalInterest, // Total de juros em centavos
        totalPayment, // Valor total em centavos
      };
    };

    // Define o resultado da simulação
    props.result = generateOutput();

    return Result.success<Simulation>(new Simulation(props));
  }

  get identifier() {
    return this.props.identifier;
  }

  get result() {
    return this.props.result;
  }

  get ttl() {
    return this.props.ttl;
  }

  getProps(): SimulationProps {
    return this.props;
  }
}
