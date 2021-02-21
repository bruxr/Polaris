import { useEffect } from 'react';

import { useStoreActions } from '../store';

function useTitle(title: string): void {
  const { setTitle } = useStoreActions((actions) => actions);

  useEffect(() => {
    document.title = `${title} - Polaris`;
    setTitle(title);
  }, [title, setTitle]);
}

export default useTitle;
