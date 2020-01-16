import React, { Fragment, useState } from 'react';
import { List, ListItem, Button, Menu, MenuItem, Avatar, Container, Tooltip, Typography, Fab } from '@material-ui/core';
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
import AppFooter from 'components/AppFooter';
import { ExpandLess } from '@material-ui/icons';

const spacingFromProfile = 20;
const footerHeight = 300;

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
  body: {
    height: "100%",
    margin: "0",
    scrollBehavior: 'smooth',
  },
  content: {
    paddingTop: spacing(8),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    position: "relative",
    minHeight: `calc(100vh - ${footerHeight}px)`,
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
      whiteSpace: "nowrap",
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
  navButton: {
    fontFamily: "Montserrat",
    fontWeight: "bold",
    fontSize: "14px",
    wordBreak: "keep-all",
  },
  background: {
    display: "block",
    position: "absolute",
    left: 0,
    width: "100%",
    maxHeight: `calc(100vh - ${footerHeight}px)`,
    zIndex: -1,
    "& img": {
      width: "100%",
      maxHeight: `calc(100vh - ${footerHeight}px)`,
    },
    "& ~ *": {
      zIndex: 0
    }
  },
  fab: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
  }
});

interface OwnProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
  onConnect(path): void;
  logOut(): void;
  isLoggedIn: boolean;
  userRole: number;
  walletUnlocked: boolean;
  approvedNetwork: boolean;
  ethAddress: string;
  userId: string;
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
  userId,
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
    <div className={classes.body}>
      <AppBar position="fixed" className={classes.appBar} >
        <Container maxWidth='lg'>
          <Toolbar disableGutters={true} className={classes.toolbar}>
            <Link className={classes.appBarLogo} to="/discover">
              <ReactSVG src="/molecule-catalyst-logo.svg" beforeInjection={(svg) => svg.setAttribute('style', 'width: 175px')} />
            </Link>
            <div className={classes.navAccount}>
              <List className={classes.navList}>
                {navRoutes.map(r => (
                  <ListItem button key={r.path} selected={r.path === location.pathname} onClick={() => forwardTo(r.path)}>
                    <Typography className="navButton">{r.name}</Typography>
                  </ListItem>
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
                    <Button onClick={() => onConnect(location.pathname)}>CONNECT</Button>
                  </div> :
                  <Tooltip 
                    open
                    title={`Please ensure that you have MetaMask installed, allowed this 
                            site to connect to MetaMask and are using the ${approvedNetworkName} network`}>
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
            {location.pathname === "/discover" && <img src="Seperator.png" alt="" />}
          </div>
          {children}
        </main>
        <AppFooter userState={{ethAddress: ethAddress, userId: userId}} />
      </ErrorBoundary>
      <Fab className={classes.fab} color="primary" aria-label="scroll-to-top" onClick={() => window.scrollTo(0, 0)}>
        <ExpandLess />
      </Fab>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
