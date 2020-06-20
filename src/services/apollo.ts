import { setContext } from '@apollo/link-context';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_URI,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export function setApolloContext(token?: string): void {
  console.info('Updating apollo client with new token.');

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  client.setLink(authLink.concat(httpLink));
}

export default client;
