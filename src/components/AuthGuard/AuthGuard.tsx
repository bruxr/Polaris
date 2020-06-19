import React, { PropsWithChildren } from 'react';
import { useRecoilState } from 'recoil';

import userAtom from '../../atoms/user';
import Signin from '../../views/Signin';

export default function AuthGuard({ children }: PropsWithChildren<unknown>): JSX.Element {
  const [user] = useRecoilState(userAtom);

  if (!user) {
    return (
      <Signin />
    );
  }

  return (
    <>{children}</>
  );
}
