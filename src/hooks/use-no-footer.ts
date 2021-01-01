import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import noFooterAtom from '../atoms/no-footer';

function useNoFooter(): void {
  const setNoFooter = useSetRecoilState(noFooterAtom);

  useEffect(() => {
    setNoFooter(true);
    
    return () => setNoFooter(false);
  }, [setNoFooter]);
}

export default useNoFooter;
