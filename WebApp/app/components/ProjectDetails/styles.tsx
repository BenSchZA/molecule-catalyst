import { Theme, createStyles } from '@material-ui/core';
import { colors } from 'theme';
import { fade } from '@material-ui/core/styles';

const bannerFooterAccentHeight = 5;
const avatarSize = 80;
const contentPadding = 40;
const fundingStatsSpacing = 10;

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    projectSection: {
      padding: `${spacing(4)}px ${spacing(8)}px`,
    },
    bannerWrapper: {
      position: 'relative',
      "&:after": {
        content: "''",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        background: colors.moleculeBranding.primary,
        zIndex: 1,
        opacity: 0.69,
      }
    },
    bannerImage: {
      width: '100%',
    },
    bannerContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: '50%',
      top: '35%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
      color: colors.white
    },
    bannerFooter: {
      width: '100%',
      height: "60px",
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
      position: 'absolute',
      left: '50%',
      bottom: 0,
      transform: 'translate(-50%, 0)',
      zIndex: 3,
      color: colors.white,
      padding: `0 ${contentPadding}px`,
      "& > *":{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        "&:first-child":{ // Left
          "& > *:last-child":{ // Profile name
          marginLeft: 20
          }
        },
        "&:last-child":{ // Right

        }
      },
      "&:before":{
        content: "''",
        display: "block",
        background: fade(colors.moleculeBranding.primary, 0.63),
        zIndex: -1,
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        borderTop: `${bannerFooterAccentHeight}px solid ${fade(colors.moleculeBranding.primary, 0.70)}`
      },

      "& h6":{
        fontSize: "12px",
      }
    },
    researcherAvatar: {
      position: 'relative',
      width: avatarSize,
      height: "100%",
      "& > *":{
        position: "absolute",
        display: "block",
        top: bannerFooterAccentHeight ? bannerFooterAccentHeight : 0,
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: avatarSize,
        width: avatarSize
      }
    },
    fundingStatusSection: {
      width: `calc(100% + ${spacing(16)}px)`,
      position: "relative",
      left: "50%",
      transform: "translate(-50%, 0)",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "stretch",
      padding: `${fundingStatsSpacing* 2}px ${avatarSize}px`,
      "&:before":{ // Background
        content: "''",
        display: "block",
        backgroundColor: colors.whiteAlt,
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translate(-50%, 0)"
      },
      "& > *":{ // Cells
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `0 ${fundingStatsSpacing}px`,
        position: "relative",
        flexGrow: 1,
        "& p":{
          padding: "2.5px 0"
        },
        "&:after":{
          content: "''",
          display: "block",
          height: "100%",
          width: 1,
          position: "absolute",
          right: 0,
          backgroundColor: palette.secondary.main
        },
        "&:last-child:after":{
          display: "none"
        }
      }
    },
    fundingStatusItem: {
      borderRight: '1px',
      borderRightColor: palette.secondary.main,
    },
    fundingPhaseSection:{
      padding: 0
    },
    projectProgress: {
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      color: palette.secondary.main,
      font: '44px/54px Montserrat',
      letterSpacing: '-0.39px',
      opacity: 1
    },
    fundingLabels: {
      font: 'Bold 12px/15px Montserrat',
      fontWeight: "bolder",
      letterSpacing: '1.07px',
      color: '#000000DE',
      opacity: 1,
      textTransform: 'uppercase'
    },
    fundingAmount: {
      font: 'Bold 18px/24px Montserrat',
      fontWeight: "bolder",
      letterSpacing: '0',
      color: '#000000DE',
      opacity: 1
    },
    contentWrapper:{
      paddingLeft: avatarSize,
      paddingRight: avatarSize,
      paddingTop: avatarSize/2,
    },
    fullWidthSection: {
      width: `calc(100% + ${spacing(16)}px)`,
      backgroundColor: colors.whiteAlt,
      marginLeft: -spacing(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: spacing(4),
      paddingBottom: spacing(4),
    },
    phasePaperTitle: {
      width: `calc(100% + ${spacing(16)}px)`,
      backgroundColor: colors.whiteAlt,
      marginLeft: -spacing(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: spacing(4),
      paddingTop: spacing(6),
      marginTop: spacing(2),
      height: 175
    },
    phaseTitleText: {
      textAlign: 'center',
      font: '30px/37px Montserrat',
      letterSpacing: '-0.26px',
      color: '#000000DE',
      opacity: 1.0,
      paddingTop: spacing(2),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      marginTop: spacing(2)
    },
    researchUpdatesSubHeading: {
      textAlign: 'center',
      maxWidth: '40vw',
      minWidth: '300px',
      paddingBottom: spacing(4),
      margin: 'auto',
      color: '#00000099'
    },
    avatar: {
      paddingTop: spacing(2),
      paddingBottom: spacing(1.5),
      width: 135,
      height: "100%",
      "& > *":{
        height: 135,
        width: 135
      }
    },
    phaseDateChip: {
      paddingTop: spacing(2),
      paddingBottom: spacing(1.5),
      width: 600,
      height: "100%",
      "& > *":{
        height: 135,
        width: 135
      }
    },
    projectLeadTitleText: {
      textAlign: 'center',
      font: '30px/37px Montserrat',
      letterSpacing: '-0.26px',
      color: '#000000DE',
      opacity: 1.0,
    },
    projectLeadText: {
      textAlign: 'center',
      font: '14px/20px Roboto',
      letterSpacing: '0.09px',
      color: '#00000099',
      opacity: 1.0
    },
    sectionTitleText: {
      paddingTop: spacing(8),
      paddingBottom: spacing(4),
      textAlign: 'center',
      font: '30px/37px Montserrat',
      letterSpacing: '-0.26px',
      color: '#000000DE',
      opacity: 1.0,
    },
    contentText: {
      textAlign: 'left',
      font: '18px/24px Roboto',
      letterSpacing: '0.17px',
      color: '#00000099',
      opacity: 1.0,
      paddingBottom: spacing(2),
      paddingTop: spacing(2),
    },
    contentTitleText: {
      fontWeight: 'bolder',
      textAlign: 'left',
      font: '18px/24px Montserrat',
      letterSpacing: 0,
      color: '#000000DE',
      opacity: 1.0,
      paddingBottom: "2px",
      paddingTop: avatarSize / 4,
    },
    startDate: {
      font: "14px Montserrat",
      fontWeight: "bolder"
    },
    abstract: {
      font: "18px/24px Montserrat",
      fontWeight: "bold",
      paddingBottom: "2px"
    },
    lastUpdated: {
      font: "12px Montserrat",
      fontWeight: "bold",
      letterSpacing: "1.88px",
      color: "#00000099",
      opacity: 0.39
    },
    phaseDates: {
      font: "12px/15px Montserrat",
      fontWeight: "bold",
      letterSpacing: "1.88px",
      color: "#00000099",
      opacity: 1,
      width: '100%',
    },
    abstractText:{
      font: "18px Roboto",
      letterSpacing: "0.17px",
      color: "#00000099",
      paddingTop: 15
    },
    fundingStatus:{
      paddingBottom: avatarSize/2
    },
    divider:{
      margin: "24px auto 32px !important",
      backgroundColor: colors.moleculeBranding.third,
      alignSelf: 'center',
      verticalAlign: 'middle',
      height: 2,
    },
    projectTitle:{
      textAlign: "center",
      font: "Bold 60px/65px Montserrat",
      letterSpacing: "0.43px",
      color: "#FFFFFF",
      textShadow: "0px 3px 6px #0000004E",
      opacity: 1,
      width: '1100px',
      paddingTop: avatarSize*1
    },
    supportProject: {
      background: '#FFFFFF 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      letterSpacing: '0.18px',
      color: '#003E52',
    },
    redeemHoldings: {
      background: '#03DAC6 0% 0% no-repeat padding-box',
      boxShadow: '0px 1px 3px #00000033',
      borderRadius: '4px',
      textAlign: 'center',
      font: 'Bold 14px/24px Montserrat',
      letterSpacing: '0.18px',
      color: '#FFFFFF'
    },
    loadingSpinner: {
      position: 'fixed',
      top: '50%',
      left: '50%',
    },
    marketSpinner: {
      display: 'flex',
      justifyContent: 'center'
    },
    avatarImage: {
      width: 50,
      height: 50,
    }
  });

export default(styles);