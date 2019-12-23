import React from 'react';
import {UserContext} from '../lib/user-context';
import AccountForms from '../components/AccountForms';
import SignOut from '../components/SignOut';

export default function AccountPage() {
  const user = React.useContext(UserContext);

  return (
    <div>
      <h1>Account Page</h1>

      {user ? (
        <>
          <p>
            Logged in as: <strong>{user.firstName}</strong>
          </p>
          <SignOut />
        </>
      ) : (
        <AccountForms />
      )}
    </div>
  );
}
