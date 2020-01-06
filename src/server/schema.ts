import {GraphQLSchema} from 'graphql';

import query from './resolvers/query';
import mutation from './resolvers/mutation';

const schema = new GraphQLSchema({
  query,
  mutation
});

export default schema;
