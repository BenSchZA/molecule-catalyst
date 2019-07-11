import { Button, Menu, MenuItem } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import { Link, NavLink } from 'react-router-dom';
import LinearProgressIndicator from '../LinearProgressIndicator';
import { AppRoute } from 'containers/App/routes';

const drawerWidth = 240;

const styles = theme => createStyles({
  root: {
    display: 'flex',
    backgroundColor: '#00b5bd',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    background: '#01223b',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
    color: 'white',
    justifyContent: 'start',
    flexGrow: 1,
  },
  profileButton: {
    marginLeft: 36,
    marginRight: 12,
  },
  hide: {
    display: 'none',
  },
  appHeading: {
    flexGrow: 1,
    textAlign: 'center',
    color: 'white',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    minHeight: '100vh',
    padding: `${theme.spacing(9)}px ${theme.spacing(3)}px ${theme.spacing(3)}px `,
  },
  logo: {
    height: '50px',
    flexGrow: 1,
  },
  appLink: {
    textDecoration: 'none', 
    paddingRight: '10px', 
    flexGrow: 1
  },
});

interface Props extends WithStyles<typeof styles> {
  isLoggedIn: boolean;
  onLogout: () => void;
  currentlySending: boolean;
  navLinks: AppRoute[];
}

class AppWrapper extends React.Component<Props> {
  public state = {
    drawerOpen: false,
    anchorEl: null,
  };

  public toggleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  public handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  public handleClose = () => {
    this.setState({ anchorEl: null });
  };

  public handleLogout = () => {
    this.handleClose();
    const { onLogout } = this.props;
    onLogout();
  }

  public render() {
    const { classes, children, isLoggedIn, currentlySending, navLinks } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar disableGutters={isLoggedIn}>
            {isLoggedIn && (
              <IconButton
                aria-label="Open drawer"
                onClick={this.toggleDrawer}
                className={classes.menuButton} >
                <MenuIcon />
              </IconButton>
            )}
            <Link to="/" className={classes.appLink}>
              <img className={classes.logo} src={(isLoggedIn) ? "https://i.imgur.com/6HDY4yZ.png" : "https://i.imgur.com/GbMCcG0.png"} />
            </Link>
            {!isLoggedIn ? (
              <div>
                <Link to="/login" style={{ textDecoration: 'none', paddingRight: '10px' }}>
                  <Button color={'secondary'} variant="contained">
                    Login
                  </Button>
                </Link>
                <Link to="/Signup" style={{ textDecoration: 'none' }}>
                  <Button color={'secondary'} variant="contained">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <IconButton
                  className={classes.profileButton}
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}>
                  <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <MenuItem onClick={this.handleClose}>
                      Profile
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={this.handleLogout}>
                    Logout
                </MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
          <LinearProgressIndicator active={currentlySending} />
        </AppBar>
        {isLoggedIn && (
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !this.state.drawerOpen && classes.drawerPaperClose),
            }}
            open={this.state.drawerOpen}>
            <div className={classes.toolbar}>
              <IconButton onClick={this.toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              {
                navLinks.map(({ name, path, routeNavLinkIcon }) => (
                  <NavLink to={path} key={name}>
                    <ListItem button>
                      <ListItemIcon>
                        {(routeNavLinkIcon) ? React.createElement(routeNavLinkIcon) : <Fragment />}
                      </ListItemIcon>
                      <ListItemText primary={name} />
                    </ListItem>
                  </NavLink>
                ))
              }
            </List>
          </Drawer>
        )}
        <main className={classes.content}>
          {children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AppWrapper);
