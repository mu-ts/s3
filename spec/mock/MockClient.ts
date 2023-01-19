export class MockClient {

  constructor(private readonly output: any) {
  }

  public async send(command: any): Promise<any> {
    return Promise.resolve(this.output);
  }
}