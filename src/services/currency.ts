/**
 * Formats a number to a human readable currency string.
 * 
 * @param input input number in cents
 */
export function currency(input: number): string {
  return (input / 100).toLocaleString();
}
