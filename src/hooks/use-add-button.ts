import { useEffect } from 'react';
import { useStoreActions } from '../store';

/**
 * Registers a callback that will be invoked when
 * the user clicks on the add button.
 *
 * @param callback callback function
 */
function useAddButton(callback: () => void): void {
  const { setAddBtn } = useStoreActions((actions) => actions);

  useEffect(() => {
    setAddBtn(callback);
    return () => setAddBtn(undefined);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useAddButton;
