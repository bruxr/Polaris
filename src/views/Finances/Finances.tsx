import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import { Carousel } from 'react-responsive-carousel';

import Sheet from '../../components/Sheet';
import AddWalletForm from './AddWalletForm';

export default function Finances(): JSX.Element {
  const [showAddWallet, setShowAddWallet] = useState(false);

  return (
    <div>
      <Carousel
        autoPlay={false}
        dynamicHeight={false}
        showArrows={false}
        showStatus={false}
        showThumbs={false}
        useKeyboardArrows={false}
      >
        <div>
          <button
            type="button"
            className="block w-full h-48 border border-dashed border-gray-500 text-gray-700 text-center"
            onClick={() => setShowAddWallet(true)}
          >
            <div className="block"><AddIcon /></div>
            Add Wallet
          </button>
        </div>
        <div>
          <button>
            <AddIcon />
            Add Wallet
          </button>
        </div>
      </Carousel>

      {showAddWallet && (
        <Sheet
          title="Add Wallet"
          onClose={() => setShowAddWallet(false)}
        >
          <AddWalletForm onCreate={() => setShowAddWallet(false)} />
        </Sheet>
      )}
    </div>
  );
}
