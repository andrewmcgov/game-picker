import React from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

import {CURRENT_USER_QUERY} from '../lib/queries';
import Error from './Error';

const SIGN_IN_MUTATION = gql`
  mutation SIGN_IN_MUTATION($email: String, $password: String) {
    signIn(email: $email, password: $password) {
      firstName
      lastName
      email
    }
  }
`;

function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [signIn, {loading, error}] = useMutation(SIGN_IN_MUTATION);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signIn({
      variables: {
        email,
        password
      },
      refetchQueries: [{query: CURRENT_USER_QUERY}]
    });
  }

  return (
    <div className="form-card account-form-card">
      {error && <Error error={error} />}
      <h3 className="account-form-heading">Sign in!</h3>
      <form
        method="post"
        onSubmit={e => handleFormSubmit(e)}
        className="signin-form"
      >
        <fieldset disabled={loading}>
          <label htmlFor="signin:email">
            Email
            <input
              type="email"
              name="email"
              placeholder="email"
              id="signin:email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="signin:password">
            Password
            <input
              type="password"
              name="password"
              placeholder="password"
              id="signin:password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </label>
          <div className="account-form-buttons">
            <button className="button button-primary" type="submit">
              Sign in!
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default SignIn;
