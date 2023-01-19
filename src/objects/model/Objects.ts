import { ObjectKey } from "./ObjectKey"

export class Objects {

  constructor(
    private readonly totalCount: number,
    private readonly pageSize: number,
    private readonly results: ObjectKey[],
    private readonly prefix?: string,
    private readonly continuationToken?: string){
  }

  getTotalCount(): number {
    return this.totalCount;
  }
  
  getPageSize(): number {
    return this.pageSize;
  }
  
  getResults(): ObjectKey[] {
    return this.results;
  }
  
  getPrefix(): string | undefined {
    return this.prefix;
  }
  
  getContinuationToken(): string | undefined {
    return this.continuationToken;
  }
}