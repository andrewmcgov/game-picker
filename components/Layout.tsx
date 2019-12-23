import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import Link from 'next/link';
import Head from 'next/head';
import {CurrentUserQueryResponse} from '../lib/types';
import {UserContext} from '../lib/user-context';
import {CURRENT_USER_QUERY} from '../lib/queries';

interface Props {
  // TODO: Figure out type that works here.
  children: any;
}

function Layout({children}: Props) {
  const {data, loading} = useQuery<CurrentUserQueryResponse>(
    CURRENT_USER_QUERY
  );
  const user = data && data.currentUser ? data.currentUser : null;
  const loadingMarkup = loading ? <p>Loading...</p> : null;

  return (
    <UserContext.Provider value={user}>
      <div>
        <Head>
          <title>Game Picker</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <header>
          <nav>
            <Link href="/">
              <a>Home</a>
            </Link>{' '}
            |{' '}
            <Link href="/about">
              <a>About</a>
            </Link>{' '}
            |{' '}
            <Link href="/account">
              <a>Account</a>
            </Link>
          </nav>
        </header>
        {loading ? loadingMarkup : children}
        <footer>
          <hr />
          <span>Footer lives here</span>
        </footer>
      </div>
    </UserContext.Provider>
  );
}

export default Layout;
