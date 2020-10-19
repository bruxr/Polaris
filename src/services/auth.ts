import GoTrue from 'gotrue-js';
import { api } from './firebase';
// import { str2ab } from './buffer';
import { User } from '../types/users';

export default new GoTrue({
  APIUrl: `${process.env.REACT_APP_NETLIFY_API}/identity`,
  setCookie: true,
});

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
