import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import Link from 'next/link';
import Head from 'next/head';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {
  AppBar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  IconButton
} from '@material-ui/core';
import {
  AccountCircle as AccountIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  SupervisorAccount as SupervisorAccountIcon
} from '@material-ui/icons';
import {CurrentUserQueryResponse} from '../lib/types';
import {UserContext} from '../lib/user-context';
import {CURRENT_USER_QUERY} from '../lib/queries';
import AccountForms from './AccountForms';

interface Props {
  // TODO: Figure out type that works here.
  children: any;
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative'
  },
  main: {
    marginTop: theme.spacing(4)
  },
  drawer: {
    width: drawerWidth
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    justifyContent: 'flex-end'
  },
  menuButton: {
    marginRight: theme.spacing(1)
  },
  hide: {
    display: 'none'
  }
}));

function Layout({children}: Props) {
  const classes = useStyles();
  const {data, loading} = useQuery<CurrentUserQueryResponse>(
    CURRENT_USER_QUERY
  );
  const user = data && data.currentUser ? data.currentUser : null;
  const loadingMarkup = loading ? <p>Loading...</p> : null;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const headerMarkup = (
    <header>
      <AppBar position="sticky" color="default" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(true)}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap>
            Playoff Pickem
          </Typography>
        </Toolbar>
      </AppBar>
    </header>
  );

  const navigationMarkup = (
    <List>
      <Link href="/">
        <div onClick={() => setDrawerOpen(false)}>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>
        </div>
      </Link>
      <Link href="/account">
        <div onClick={() => setDrawerOpen(false)}>
          <ListItem button>
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary={'Account'} />
          </ListItem>
        </div>
      </Link>
      <Link href="/admin">
        <div onClick={() => setDrawerOpen(false)}>
          <ListItem button>
            <ListItemIcon>
              <SupervisorAccountIcon />
            </ListItemIcon>
            <ListItemText primary={'Admin'} />
          </ListItem>
        </div>
      </Link>
    </List>
  );

  const drawerMarkup = (
    <Drawer
      className={classes.drawer}
      variant="temporary"
      anchor="left"
      open={drawerOpen}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      {navigationMarkup}
    </Drawer>
  );

  const mainMarkup =
    user && user._id ? (
      <main className={classes.main}>{loading ? loadingMarkup : children}</main>
    ) : (
      <AccountForms />
    );

  return (
    <div>
      <Head>
        <title>Game Picker</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <UserContext.Provider value={user}>
        <CssBaseline />
        {headerMarkup}
        {drawerMarkup}
        {mainMarkup}
      </UserContext.Provider>
    </div>
  );
}

export default Layout;
