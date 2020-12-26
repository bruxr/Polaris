import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import titleAtom from '../atoms/title';

function useTitle(title: string): void {
  const setTitle = useSetRecoilState(titleAtom);

  useEffect(() => {
    document.title = `${title} - Polaris`;
    setTitle(title);
  }, [title, setTitle]);
}

export default useTitle;
