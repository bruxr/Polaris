import { gql } from '@apollo/client';

export default gql`
  mutation AddPackage($courier: String!, $code: String!) {
    addPackage(input: { courier: $courier, trackingCode: $code }) {
      package {
        id
        courier
        eta
        lastStatus
        lastTimestamp
        createdAt
      }
      errors {
        message
      }
    }
  }
`;
