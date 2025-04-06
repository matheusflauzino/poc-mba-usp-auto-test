export abstract class Entity<T> {
  protected readonly _id: number;
  protected props: T;

  constructor(props: T) {
    this.props = props;
  }
}
