import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const TEST_QUERY = gql`
  query test {
    testQuery
  }
`;

function IndexPage() {
  const {data, loading, error} = useQuery(TEST_QUERY);

  return (
    <>
      <h1>game-picker</h1>
      <p>this will be the game picker</p>

      {loading && <p>Loading...</p>}
      {error && <p>error...</p>}
      {data && data.testQuery}
    </>
  );
}
export default IndexPage;
