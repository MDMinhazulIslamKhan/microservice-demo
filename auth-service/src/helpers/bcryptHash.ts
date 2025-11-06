import bcrypt from 'bcrypt';

/**
 * Hashes a given string using bcrypt.
 *
 * @param value The string to hash.
 * @param saltRounds The number of salt round.
 * @returns A promise that resolves to the hashed string.
 */
export const hashWithBcrypt = async (
  value: string,
  saltRounds: number
): Promise<string> => {
  const hashedValue = await bcrypt.hash(value, saltRounds);
  return hashedValue;
};

/**
 * Compares a plain string with a hashed string to see if they match.
 * @param value The plain string.
 * @param hashedValue The hashed string to compare.
 * @returns A promise that resolves to true if the strings match, and false otherwise.
 */
export const isBcryptHashedMatched = async (
  value: string,
  hashedValue: string
): Promise<boolean> => {
  const isMatched = await bcrypt.compare(value, hashedValue);
  return isMatched;
};
