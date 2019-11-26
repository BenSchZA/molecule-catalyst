import { Theme, createStyles, WithStyles, Grid, Typography, withStyles } from "@material-ui/core";
import React from "react";
import ReactSVG from "react-svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegramPlane, faTwitter, faGitlab, faDiscord } from "@fortawesome/free-brands-svg-icons";
import * as Sentry from '@sentry/browser';

const footerHeight = 300;

const styles = (theme: Theme) => createStyles({
  footer: {
    flexGrow: 1,
    height: `${footerHeight}px`,
    backgroundColor: "#003E52",
  },
  footerExplainerText: {
    textAlign: "left",
    fontFamily: "Montserrat",
    fontSize: "12px",
    fontWeight: "lighter",
    letterSpacing: 0,
    color: "#FFFFFFDE",
    opacity: 1.0,
    paddingBottom: "10px",
  },
  footerColumnTitle: {
    textAlign: "left",
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: "bolder",
    letterSpacing: 0,
    color: "#FFFFFFDE",
    opacity: 1.0,
  },
  footerLinkText: {
    textAlign: "left",
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: "lighter",
    letterSpacing: 0,
    color: "#FFFFFFDE",
    opacity: 1.0,
    paddingBottom: "3px",
    cursor: 'pointer',
    "&:link": {
      textDecoration: "none",
    },
    "&:visited": {
      textDecoration: "none",
    },
    "&:hover": {
      textDecoration: "underline",
    },
    "&:active": {
      textDecoration: "underline",
    },
  },
  footerCopyrightText: {
    textAlign: "left",
    fontFamily: "Montserrat",
    fontSize: "14px",
    fontWeight: "lighter",
    letterSpacing: 0,
    color: "#FFFFFFDE",
    opacity: 1.0,
  },
  footerCopyrightLogo: {
    paddingRight: "7px"
  },
  footerLogo: {
    paddingBottom: "10px",
  },
  footerIcon: {
    paddingRight: "6px",
  },
  footerGridContainer: {
    paddingLeft: "145px",
    paddingRight: "145px",
    paddingTop: "35px",
  },
  footerGridRowOne: {
    paddingBottom: "50px"
  },
  underline: {
    top: "1871px",
    left: "143px",
    width: "87px",
    height: "0px",
    border: "1px solid #FFFFFF",
    opacity: 1.0,
    marginBottom: "15px",
  },
});

interface OwnProps extends WithStyles<typeof styles> {
  userState: object;
}

type Props = OwnProps;

const AppFooter: React.FunctionComponent<Props> = ({
  classes,
  userState,
}) => {

  let getSupport = () => {
    Sentry.withScope((scope) => {
      scope.setTag("env", `${process.env.APP_NAME}`);
      scope.setExtra('user', userState);
      const eventId = Sentry.captureMessage('Support Request');
      Sentry.showReportDialog({ eventId });
    });
  }

  return (
    <footer className={classes.footer}>
      <Grid container spacing={0} className={classes.footerGridContainer}>
        <Grid item xs={2}>
          <Typography className={classes.footerColumnTitle}>
            Company
            </Typography>
          <div className={classes.underline} />
          <table>
            <tbody>
              <tr>
                <td><a className={classes.footerLinkText} href="https://molecule.to/#whatisSection">About Molecule</a></td>
              </tr>
              <tr>
                <td><a className={classes.footerLinkText} href="https://catalyst.molecule.to/terms-of-use">Terms Of Use</a></td>
              </tr>
              <tr>
                <td><a className={classes.footerLinkText} href="https://catalyst.molecule.to/privacy-policy">Privacy Policy</a></td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid item xs={2}>
          <Typography className={classes.footerColumnTitle}>
            Contact
            </Typography>
          <div className={classes.underline} />
          <table>
            <tbody>
              <tr>
                <td><a className={classes.footerLinkText} href="https://linumlabs.us16.list-manage.com/subscribe?u=d57b55c1eebd6157cac3bc43e&id=9e8b521c19">Stay Updated</a></td>
              </tr>
              <tr>
                <td><a className={classes.footerLinkText} href="https://docs.google.com/forms/d/e/1FAIpQLSf6KWvf68w9FMqMXHLJYfS2DBfwW7sxVgqLchoK3ZBj_S5rKA/viewform?usp=sf_link">Submit Proposal</a></td>
              </tr>
              <tr>
                <td><a className={classes.footerLinkText} onClick={() => getSupport()}>Support</a></td>
              </tr>
              <tr>
                <td><a className={classes.footerLinkText} href="mailto:info@molecule.to">Contact</a></td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid item xs={2}>
          <Typography className={classes.footerColumnTitle}>
            Site
            </Typography>
          <div className={classes.underline} />
          <table>
            <tbody>
              <tr>
                <td><a className={classes.footerLinkText} href="https://catalyst.molecule.to/learn">Learn</a></td>
              </tr>
              <tr>
                <td><a className={classes.footerLinkText} href="https://catalyst.molecule.to/faqs">FAQs</a></td>
              </tr>
              <tr>
                <td><a className={classes.footerLinkText} href="https://alpha-nightly.mol.ai/discover">Discover</a></td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid className={classes.footerGridRowOne} item xs={6}>
          <ReactSVG className={classes.footerLogo} src="/footer-logo-long.svg" beforeInjection={(svg) => svg.setAttribute('style', 'height: 28px')} />
          <Typography className={classes.footerExplainerText}>
            Molecule Catalyst is a software platform to accelerate innovation in the pharmaceutical industry. It connects scientists, patients and industry to advance scientific research and development in a collaborative ecosystem.
            </Typography>
          <a href="https://t.me/MoleculeProtocol">
            <FontAwesomeIcon className={classes.footerIcon} icon={faTelegramPlane} color="white" size="2x" />
          </a>
          <a href="https://twitter.com/Molecule_to">
            <FontAwesomeIcon className={classes.footerIcon} icon={faTwitter} color="white" size="2x" />
          </a>
          <a href="https://gitlab.com/linumlabs/molecule-alpha/">
            <FontAwesomeIcon className={classes.footerIcon} icon={faGitlab} color="white" size="2x" />
          </a>
          <a href="https://discord.gg/cf3WTJ">
            <FontAwesomeIcon className={classes.footerIcon} icon={faDiscord} color="white" size="2x" />
          </a>
        </Grid>
        <Grid item xs={12}>
          <table>
            <tbody>
              <tr>
                <td>
                  <ReactSVG className={classes.footerCopyrightLogo} src="/footer-logo.svg" beforeInjection={(svg) => svg.setAttribute('style', 'height: 34px')} />
                </td>
                <td>
                  <Typography className={classes.footerCopyrightText}>©2019 Linum Labs AG</Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Grid>
    </footer>
  );
}

export default withStyles(styles, { withTheme: true })(AppFooter);
