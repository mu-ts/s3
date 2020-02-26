export class List<T> extends Array<T> {
  private readonly continuationToken: string;
  constructor(continuationToken: string) {
    super();
    this.continuationToken = continuationToken;
  }
}
