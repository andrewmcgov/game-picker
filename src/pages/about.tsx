import * as React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const TEST_QUERY = gql`
  query about {
    aboutQuery
  }
`;

function About() {
  const {data, loading, error} = useQuery(TEST_QUERY);

  return (
    <>
      <h1>About Page</h1>
      <p>This is the about page.</p>

      {loading && <p>Loading...</p>}
      {error && <p>error...</p>}
      {data && data.aboutQuery}
    </>
  );
}
export default About;
