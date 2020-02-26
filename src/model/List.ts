export class List<T> extends Array<T> {
  private readonly _continuationToken: string;
  constructor(continuationToken?: string) {
    super();
    this._continuationToken = continuationToken;
  }
  public get continuationToken() {
    return this._continuationToken;
  }
}
