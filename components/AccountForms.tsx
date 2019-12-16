import React from 'react';

import SignIn from './SignIn';
import SignUp from './SignUp';

function AccountForms() {
  const [signUp, setSignUp] = React.useState(false);

  function handleFormChange(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) {
    e.preventDefault();
    setSignUp(signUp => !signUp);
  }

  if (signUp) {
    return (
      <div className="account-forms__toggle">
        <SignUp />
        <p>
          Already have an account? Click{' '}
          <a
            className="account-forms__toggle-link"
            href=""
            onClick={e => handleFormChange(e)}
          >
            here
          </a>{' '}
          to sign in!
        </p>
      </div>
    );
  }

  return (
    <div className="account-forms__toggle">
      <SignIn />
      <p>
        Need an account? Click{' '}
        <a
          className="account-forms__toggle-link"
          href=""
          onClick={e => handleFormChange(e)}
        >
          here
        </a>{' '}
        to sign up!
      </p>
    </div>
  );
}

export default AccountForms;
