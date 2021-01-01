import React, { useState } from 'react';

import { seed } from '../../db/seeds';
import Button from '../../components/Button';
import useTitle from '../../hooks/use-title';
import useNoFooter from '../../hooks/use-no-footer';

function Settings(): React.ReactElement {
  useTitle('Settings');
  useNoFooter();

  const [seeding, setSeeding] = useState(false);

  return (
    <div>
      <h3 className="text-lg font-semibold">Seed Data</h3>
      <p className="mb-4 text-gray-500">Press the button below to seed initial data for Polaris</p>
      <Button
        type="button"
        variant="link"
        loading={seeding}
        onClick={async () => {
          setSeeding(true);
          seed();
          setSeeding(false);
        }}
      >
        Seed Initial Data
      </Button>
    </div>
  );
}

export default Settings;
