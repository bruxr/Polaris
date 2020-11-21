import { api } from './firebase';
// import { str2ab } from './buffer';
import { User } from '../types/users';
import GoTrue, { User as GoTrueUser } from 'gotrue-js';

export default new GoTrue({
  APIUrl: `${process.env.REACT_APP_NETLIFY_API}/identity`,
  setCookie: true,
});

export function deserializeUser(user: GoTrueUser): User {
  return {
    id: user.id,
    name: user.user_metadata.full_name,
    email: user.email,
    token: user.token.access_token,
  };
}

export async function registerTouchId(user: User): Promise<void> {
  if (!user.email) {
    throw new Error('Cannot authenticate without user');
  }

  const challengeResult = await api('generateChallenge')();
  console.log(challengeResult);

  const canAuth = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  if (!canAuth) {
    return;
  }

  // const credential = await navigator.credentials.create({
  //   publicKey: {
  //     rp: { name: 'polaris.bruxromuar.com' },
  //     user: {
  //       id: str2ab(user.id),
  //       name: user.email,
  //       displayName: user.name || '',
  //     },
  //     pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
  //     challenge: str2ab(challengeResult.data.challenge),
  //     authenticatorSelection: { authenticatorAttachment: 'platform' },
  //     attestation: 'direct',
  //   },
  // });

}
