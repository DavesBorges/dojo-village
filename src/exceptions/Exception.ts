export class Exception extends Error {
  constructor(public errorOrObject?: string | Record<string, any>) {
    super('Exception');
  }
}
