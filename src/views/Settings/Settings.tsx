import React, { useState } from 'react';

import { getDb } from '../../services/db';
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
      <section className="mb-4">
        <h3 className="text-lg font-semibold">Seed Data</h3>
        <p className="mb-4 text-gray-500">Press the button below to seed initial data for Polaris</p>
        <Button
          type="button"
          variant="link"
          loading={seeding}
          onClick={async () => {
            setSeeding(true);
            await seed();
            setSeeding(false);
            alert('Seeding finished!');
          }}
        >
          Seed Initial Data
        </Button>
      </section>

      <section>
        <h3 className="text-lg font-semibold">Delete Database</h3>
        <p className="mb-4 text-gray-500">Deleting the database will destroy all local records but will not affect
        the remote mother server.</p>
        <Button
          type="button"
          variant="link"
          onClick={async () => {
            if (confirm('Are you sure you want to delete the local database?')) {
              const db = getDb();
              await db.destroy();
            }
          }}
        >
          Delete Local Database
        </Button>
      </section>
    </div>
  );
}

export default Settings;
