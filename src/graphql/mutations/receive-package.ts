import { gql } from '@apollo/client';

export default gql`
  mutation ReceivePackage($id: ID!, $received: Boolean!) {
    updatePackage(input: { id: $id, received: $received }) {
      errors {
        message
      }
    }
  }
`;
