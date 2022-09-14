import { v4 as uuid } from 'uuid';

/**
 * Generate an Universal Unique Identifier aka UUID
 * @returns the UUID string without the - (hiphens)
 */
export const generateUUID = (): string => {
  const uniqueId = uuid().replace(/-/g, '');

  return uniqueId;
};
