import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';

interface Props {
  // TODO: Figure out type that works here.
  children: any;
}

function Layout({children}: Props) {
  return (
    <div>
      <Head>
        <title>Game Picker</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>{' '}
          |{' '}
          <Link href="/about">
            <a>About</a>
          </Link>
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        <span>Footer lives here</span>
      </footer>
    </div>
  );
}

export default Layout;
