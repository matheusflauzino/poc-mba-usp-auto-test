/* eslint-disable prettier/prettier */
import { Errors } from '@shared';
export abstract class Interactor {
  public abstract execute(input?: any): any;
}
export abstract class InteractorValidatable {
  public abstract execute(input: any): any;
  protected abstract validateInput(input: any): any;
}

export abstract class InteractorValidatableWithInput<T> {
  public abstract execute(input: any): any;

  protected validateInput(input: T) {
    const requiredFields = Object.keys(input as Required<T>).filter((key) => {
      return !(key in ({} as Partial<Required<T>>));
    });

    for (const field of requiredFields) {
      if (!input[field as keyof T]) {
        throw new Errors.MissingParam(field);
      }
    }
  }
}
