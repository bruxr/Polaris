import { setContext } from '@apollo/link-context';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_API_URI,
});

let authLink = setContext(() => {
  // Do nothing
});

export function setApolloContext(token?: string): void {
  authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
}

export default new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});
