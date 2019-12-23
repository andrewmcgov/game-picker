import * as React from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import Error from './Error';
import {CURRENT_USER_QUERY} from '../lib/queries';

export const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
    $firstName: String
    $lastName: String
    $email: String
    $password: String
    $repeatPassword: String
    $signupKey: String
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      repeatPassword: $repeatPassword
      signupKey: $signupKey
    ) {
      firstName
      lastName
      email
    }
  }
`;

function SignUp() {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [signupKey, setSignupKey] = React.useState('');

  const [signUp, {loading, error}] = useMutation(SIGN_UP_MUTATION, {
    refetchQueries: [{query: CURRENT_USER_QUERY}]
  });

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signUp({
      variables: {
        firstName,
        lastName,
        email,
        password,
        repeatPassword,
        signupKey
      }
    });
  }

  return (
    <>
      {error && <Error error={error} />}
      <div className="form-card account-form-card">
        <h3 className="account-form-heading">Sign up!</h3>
        <form
          method="post"
          onSubmit={e => handleFormSubmit(e)}
          className="signin-form"
        >
          <fieldset disabled={loading}>
            <div className="form-input-pairing">
              <label htmlFor="signin:firstName">
                First name
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  id="signup:firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </label>
              <label htmlFor="signin:lastName">
                Last Name
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  id="signup:lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </label>
            </div>
            <label htmlFor="signin:email">
              Email
              <input
                type="email"
                name="email"
                placeholder="email"
                id="signup:email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <div className="form-input-pairing">
              <label htmlFor="signin:password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  id="signup:password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </label>
              <label htmlFor="signin:repeatPassword">
                Repeat Password
                <input
                  type="password"
                  name="repeatPassword"
                  placeholder="Repeat password"
                  id="signup:repeatPassword"
                  value={repeatPassword}
                  onChange={e => setRepeatPassword(e.target.value)}
                />
              </label>
            </div>
            <label htmlFor="signin:signupKey">
              Singup Key
              <input
                type="text"
                name="signupKey"
                placeholder="Singup key"
                id="signup:signupKey"
                value={signupKey}
                onChange={e => setSignupKey(e.target.value)}
              />
            </label>
            <div className="account-form-buttons">
              <button className="button button-primary" type="submit">
                Sign up!
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default SignUp;
