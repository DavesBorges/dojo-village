import { Exception } from './Exception';

export class PermissionDeniedException extends Exception {
  constructor(reason?: string) {
    super(reason);
  }
}
