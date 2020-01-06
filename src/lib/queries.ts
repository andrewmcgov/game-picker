import gql from 'graphql-tag';

export const CURRENT_USER_QUERY = gql`
  query currentUser {
    currentUser {
      email
      firstName
      lastName
      _id
    }
  }
`;

export const TEAMS_QUERY = gql`
  query teams {
    teams {
      _id
      name
      nickname
      city
      abr
      league
    }
  }
`;
