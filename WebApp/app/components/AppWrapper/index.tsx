import React, { Fragment, useState } from 'react';
import { List, ListItem, Button, Menu, MenuItem, Avatar } from '@material-ui/core';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link, RouteComponentProps } from 'react-router-dom';
import ReactSVG from 'react-svg';
import { AppRoute } from 'containers/App/routes';
import Blockies from 'react-blockies';
import { colors } from 'theme';
import { forwardTo } from 'utils/history';
import { UserType } from 'containers/App/types';
import ErrorBoundary from 'containers/ErrorBoundary';


// import { appRoute } from 'containers/App/routes';


const styles = ({ spacing, zIndex, mixins }: Theme) => createStyles({
  appBar: {
    zIndex: zIndex.drawer + 1,
  },
  appBarLogo: {
    paddingLeft: spacing(3),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    ...mixins.toolbar,
  },
  content: {
    paddingTop: spacing(8),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    backgroundColor: colors.lightGrey,
    minHeight: '100vh'
  },
  navAccount: {
    display: 'flex',
    height: '',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
    '& > *': {
      display: 'inline-block',
      alignSelf: 'center',
    }
  },
  navList: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
    '& > *': {
      margin: `0px ${spacing(4)}px 0px ${spacing(4)}px`,
      textAlign: 'center',
      color: colors.white,
    },
  },
  avatar: {
    marginRight: spacing(3),
  },
  connectButton: {
    marginRight: spacing(3),
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  onConnect(): void;
  logOut(): void;
  isLoggedIn: boolean;
  userRole: number;
  walletUnlocked: boolean;
  ethAddress: string;
  selectedNetworkName: string;
  navRoutes: Array<AppRoute>;
}


type Props = OwnProps & RouteComponentProps;

const AppWrapper: React.FunctionComponent<Props> = ({
  classes,
  children,
  navRoutes,
  isLoggedIn,
  onConnect,
  ethAddress,
  walletUnlocked,
  logOut,
  userRole,
  location,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState<EventTarget | null>(null);


  return (
    <Fragment>
      <AppBar position="fixed" className={classes.appBar} >
        <Toolbar disableGutters={true} className={classes.toolbar}>
          <Link className={classes.appBarLogo} to="/discover">
            <ReactSVG src="molecule-logo.svg" />
          </Link>
          <div className={classes.navAccount}>
            <List className={classes.navList}>
              {navRoutes.map(r => (
                <ListItem button key={r.path} selected={r.path === location.pathname} onClick={() => forwardTo(r.path)}>{r.name}</ListItem>
              ))}
              {(userRole === UserType.Admin) &&
                <Fragment>
                  <ListItem button onClick={(e) => setAdminMenuAnchorEl(e.currentTarget)}>Admin</ListItem>
                  <Menu
                    anchorEl={adminMenuAnchorEl as Element}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(adminMenuAnchorEl)}
                    onClose={() => setAdminMenuAnchorEl(null)}>
                    <MenuItem button onClick={() => { setAdminMenuAnchorEl(null); forwardTo('/admin/users') }}>Users</MenuItem>
                    <MenuItem button onClick={() => { setAdminMenuAnchorEl(null); forwardTo('/admin/projects') }}>Projects</MenuItem>
                  </Menu>
                </Fragment>}
            </List>
            {!isLoggedIn ? (
              <div className={classes.connectButton}>
                <Button onClick={() => onConnect()} disabled={!walletUnlocked}>CONNECT</Button>
              </div>
            ) : (
                <Fragment>
                  <Avatar onClick={(e) => setAnchorEl(e.currentTarget)} className={classes.avatar}>
                    <Blockies seed={ethAddress || '0x'} size={10} />
                  </Avatar>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl as Element}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => { setAnchorEl(null); logOut() }}>Log Out</MenuItem>
                  </Menu>
                </Fragment>
              )}
          </div>
        </Toolbar>
      </AppBar>
      <ErrorBoundary>
        <main className={classes.content}>
          {children}
        </main>
      </ErrorBoundary>
    </Fragment>
  );
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
