import { useEffect } from 'react';
import { useSetRecoilState, useResetRecoilState } from 'recoil';

import addButtonAtom from '../atoms/add-button';

/**
 * Registers a callback that will be invoked when
 * the user clicks on the add button.
 *
 * @param callback callback function
 */
function useAddButton(callback: () => void): void {
  const setAddBtn = useSetRecoilState(addButtonAtom);
  const resetAddBtn = useResetRecoilState(addButtonAtom);

  useEffect(() => {
    setAddBtn({
      onClick: callback,
    });

    return () => resetAddBtn();
  }, [callback, setAddBtn, resetAddBtn]);
}

export default useAddButton;
