import { useEffect } from 'react';

import { useStoreActions } from '../store';

function useNoFooter(): void {
  const { setFooterVisible } = useStoreActions((actions) => actions);

  useEffect(() => {
    setFooterVisible(false);
    
    return () => setFooterVisible(true);
  }, [setFooterVisible]);
}

export default useNoFooter;
