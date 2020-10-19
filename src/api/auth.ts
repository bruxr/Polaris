/**
 * Requests the server to generate a challenge.
 */
export async function generateChallenge(): Promise<string> {
  const res = await fetch('/.netlify/functions/challenge');
  const data = await res.json();

  return data.challenge;
}
