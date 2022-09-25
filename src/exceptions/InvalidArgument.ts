import { Exception } from './Exception';

export class InvalidArgumentException extends Exception {
  constructor(message?: string) {
    super(message);
  }
}
