import { Document } from '../model/Document';

export interface DocumentDecorator {
  decorate(target: any, source: any): Document;
  get(target: any): Document;
}
