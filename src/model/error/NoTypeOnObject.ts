export class NoTypeOnObject extends Error {
  constructor() {
    super('The object passed in does not have a type defined. Decorate the constructing class appropriately.');
  }
}
