import { createStyles, WithStyles, Typography, withStyles } from "@material-ui/core";
import React from "react";
import { compose } from "redux";

const styles = () => createStyles({
    disclaimerBorder: {
        background: "#002835 0% 0% no-repeat padding-box",
        border: "1px solid #268982",
        borderRadius: "20px",
        opacity: 1.0,
        display: "inline-block",
        paddingLeft: "25px",
        paddingRight: "25px",
        paddingTop: "7px",
        paddingBottom: "7px",
        marginTop: "26px",
        marginBottom: "20px",
    },
    disclaimerText: {
        textAlign: "left",
        fontFamily: "Roboto",
        fontSize: "14px",
        letterSpacing: "0.46px",
        color: "#37B4A4",
        opacity: 1.0,
        textAlignLast: "center",
    },
});

interface OwnProps extends WithStyles<typeof styles> {
  classes: any;
}

const ProjectDisclaimer: React.FunctionComponent<OwnProps> = ({classes}: OwnProps) => (
  <div className={classes.disclaimerBorder}>
    <Typography className={classes.disclaimerText}>
      This app is in beta. Please use at your own risk.
    </Typography>
  </div>
);

export default compose(withStyles(styles, { withTheme: true }))(ProjectDisclaimer);
