import React, { Fragment, useState } from 'react';
import { List, ListItem, Button, Menu, MenuItem, Avatar, Container, Tooltip } from '@material-ui/core';
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
const spacingFromProfile = 20;

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
    position: "relative",
    minHeight: '100vh',

  },
  navAccount: {
    display: 'flex',
    height: spacing(8),
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
    height: "100%",
    flexDirection: 'row',
    margin: `0 ${spacingFromProfile}px 0 0`,
    padding: 0,
    '& > *': {
      margin: `0`,
      textAlign: 'center',
      color: colors.white,
      display: "inline-flex",
      justifyContent: "center",
    },
  },
  avatar: {
    marginRight: spacing(3),
  },
  connectButton: {
    marginRight: spacing(3),
    "& > *": {
      margin: 0
    }
  },
  background: {
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: -1,
    "& img": {
      width: "100%"
    },
    "& ~ *": {
      zIndex: 0
    }
  },
});

interface OwnProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  onConnect(): void;
  logOut(): void;
  isLoggedIn: boolean;
  userRole: number;
  walletUnlocked: boolean;
  approvedNetwork: boolean;
  ethAddress: string;
  navRoutes: Array<AppRoute>;
  approvedNetworkName: string;
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
  approvedNetwork,
  approvedNetworkName,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState<EventTarget | null>(null);


  return (
    <Fragment>
      <AppBar position="fixed" className={classes.appBar} >
        <Container maxWidth='lg'>
          <Toolbar disableGutters={true} className={classes.toolbar}>
            <Link className={classes.appBarLogo} to="/discover">
              <ReactSVG src="/molecule-catalyst-logo.svg" beforeInjection={(svg) => svg.setAttribute('style', 'height: 45px')} />
            </Link>
            <div className={classes.navAccount}>
              <List className={classes.navList}>
                {navRoutes.map(r => (
                  <ListItem button key={r.path} selected={r.path === location.pathname} onClick={() => forwardTo(r.path)}>{r.name}</ListItem>
                ))}
                {(isLoggedIn && userRole === UserType.Admin) &&
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
                (walletUnlocked && approvedNetwork) ?
                  <div className={classes.connectButton}>
                    <Button onClick={() => onConnect()}>CONNECT</Button>
                  </div> :
                  <Tooltip 
                    title={`Please ensure you have Metamask installed, 
                    you have allowed this site to connect to Metamask 
                    and the ${approvedNetworkName} network is selected in Metamask`}>
                    <div className={classes.connectButton}>
                      <Button onClick={() => { }} disabled>CONNECT</Button>
                    </div>
                  </Tooltip>
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
        </Container>
      </AppBar>
      <ErrorBoundary>
        <main className={classes.content}>
          <div className={classes.background}>
            <img src="Seperator-02.png" alt="" />
          </div>
          {children}
        </main>
      </ErrorBoundary>
    </Fragment>
  );
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
