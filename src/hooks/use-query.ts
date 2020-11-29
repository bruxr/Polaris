import { useMemo } from 'react';
import keysIn from 'lodash/keysIn';
import { DocumentNode, useQuery as useApolloQuery } from '@apollo/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useQuery<T>(query: DocumentNode, deserializer?: (input: any) => T): T[] | undefined {
  const { data } = useApolloQuery(query, {
    onError: (error) => {
      throw error;
    },
  });
  const key = keysIn(data)[0];

  const items = useMemo<T[] | undefined>(() => {
    if (!data) {
      return;
    }

    if (deserializer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data[key].data.map((item: any) => deserializer(item));
    } else {
      return data[key].data;
    }
  }, [key, data, deserializer]);

  return items;
}

export default useQuery;
