/* Inspired from Atom
  https://github.com/atom/tabs
  https://github.com/atom/atom-dark-ui
*/

import { faBlackboard } from "@fortawesome/free-solid-svg-icons";

const TabStyles = {
  tabWrapper: {
    height: "100%",
    width: "100%",
    position: "relative",
  },

  tabBar: {
    // @TODO safari needs prefix. Style should be define in CSS.
    // Can't use duprecated key's for inline-style.
    // See https://github.com/facebook/react/issues/2020
    // display: '-webkit-flex',
    // display: '-ms-flexbox',
    display: "flex",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    margin: 0,
    listStyle: "none",
    outline: "0px",
    overflowY: "hidden",
    overflowX: "hidden",
    minWidth: "100%",
    maxWidth: "100%",
    paddingRight: "35px",
    borderTop: "1px solid #d8d7d7",
    paddingLeft: "0",
    paddingTop: "8px",
    // marginLeft: '-32px',
    // overflowX: 'scroll',
    // overflowY: 'hidden',
  },
  /* width */
  // tabBar::{-webkit-scrollbar}{
  //   width: '2px',
  // },

  // tabBar::{-webkit-scrollbar-track} :{
  //   background: '#f1f1f1',
  // },

  // /* Handle */
  // tabBar::{-webkit-scrollbar-thumb}: {
  //   background: '#888',
  // },

  // /* Handle on hover */
  // tabBar::{-webkit-scrollbar-thumb}:hover: {
  //   background: '#555',
  // },
  tabBarAfter: {
    content: "",
    position: "absolute",
    top: "26px",
    height: "2px",
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "var(--main-color)",
    borderBottom: "1px solid #1e3989",
    pointerEvents: "none",
  },

  tab: {
    fontFamily: "'heebo', sans-sari",
    backgroundImage: "linear-gradient(#7192aa, #7192aa)",
    // backgroundImage: 'linear-gradient(#454545, #333333)',
    height: "43px",
    fontSize: "14px",
    position: "relative",
    marginLeft: "14px",
    paddingLeft: "15px",
    paddingRight: "30px",
    paddingTop: "7px",
    WebkutBoxFlex: 1,
    // WebkitFlex: 1,
    // MozFlex: 1,
    // msFlex: 1,
    // flex: 1,
    display: "inline-block",
    // maxWidth: '175px',
    minWidth: "0px",
    fontWeight: "100",
    transform: "translate(0px, 0px)",
    // borderTop: '1px solid #d8d7d7',
    borderTopRightRadius: "8px",
    borderTopLeftRadius: "8px",
    cursor: "pointer",
    marginTop: "5px",
  },

  tabBefore: {
    cursor: "pointer",
    content: "",
    position: "absolute",
    top: "0px",
    width: "10px",
    height: "43px",

    left: "-14px",
    borderTopLeftRadius: "8px",
    // boxShadow: 'inset 1px 1px 0 #484848, -4px 0px 4px rgba(0, 0, 0, 0.1)',
    // WebkitTransform: 'skewX(-30deg)',
    // MozTransform: 'skewX(-30deg)',
    // msTransform: 'skewX(-30deg)',
    // transform: 'skewX(-30deg)',
    backgroundImage: "linear-gradient(#7192aa, #7192aa)",
    // backgroundImage: 'linear-gradient(#454545, #333333)',
    // borderRadius: '7.5px 0 0 0',
    //borderLeft: "1px solid #d8d7d7",
    marginLeft: "10px",
  },

  tabAfter: {
    cursor: "pointer",
    content: "",
    position: "absolute",
    top: "0px",
    width: "25px",
    height: "43px",
    right: "-17px",
    borderTopRightRadius: "8px",
    // boxShadow: 'inset -1px 1px 0 #484848, 4px 0px 4px rgba(0, 0, 0, 0.1)',
    // WebkitTransform: 'skewX(30deg)',
    // MozTransform: 'skewX(30deg)',
    // msTransform: 'skewX(30deg)',
    // transform: 'skewX(30deg)',
    backgroundImage: "linear-gradient(#7192aa, #7192aa)",
    // backgroundImage: 'linear-gradient(#454545, #333333)',
    // borderRadius: '0 7.5px 0 0',
    //borderRight: "1px solid #d8d7d7",
    marginRight: "16px",
  },

  tabTitle: {
    cursor: "pointer",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    marginTop: "0px",
    float: "left",
    textAlign: "left",
    postion: "relative",
    // width: '90%',
    color: "white",
    fontWeight: "500",
    fontSize: "14px",
    fontFamily: "'Heebo', sans-serif",
    // color: 'rgb(170, 170, 170)',
  },

  tabActive: {
    // WebkutBoxFlex: 2,
    // WebkitFlex: 2,
    // MozFlex: 2,
    // msFlex: 2,
    // flex: 2,
    marginLeft: "13px",
    display: "inline-block",
    zIndex: 1,
    color: "#4c5866",
    fontWeight: "500",
    fontSize: "13px",
    backgroundImage: "linear-gradient(#f5f5f5, #f5f5f5)",
  },

  tabBeforeActive: {
    backgroundImage: "linear-gradient(#f5f5f5, #f5f5f5)",
  },

  tabAfterActive: {
    backgroundImage: "linear-gradient(#f5f5f5, #f5f5f5)",
  },

  tabTitleActive: {
    lineHeight: "1.5em",
    color: "#4c5866",
    marginTop: "0px",
    fontWeight: "500",
  },

  tabOnHover: {
    // backgroundImage: "linear-gradient(#7192aa, #7192aa)",
  },

  tabBeforeOnHover: {
    // backgroundImage: "linear-gradient(#7192aa, #7192aa)",
  },

  tabAfterOnHover: {
    // backgroundImage: "linear-gradient(#7192aa, #7192aa)",
  },

  tabTitleOnHover: {
    filter: "alpha(opacity=20)",
    // color:'white'
  },
  tabCloseIconActive: {
    color: "Black",
  },
  // tabCloseIconBefore:{
  //   color:'white' !important,
  // },
  tabCloseIcon: {
    position: "absolute",
    cursor: "pointer",
    fontSize: "18px",
    //fontFamily: "'segoeui', sans-sari",
    fontFamily: "'Heebo', sans-serif",
    // font: "16px arial, sans-serif",
    right: "3px",
    marginTop: "2px",
    textDecoration: "none",
    textShadow: "rgb(255, 255, 255) 0px 1px 0px",
    lineHeight: "1em",
    filter: "alpha(opacity=20)",
    opacity: "10",
    width: "20px",
    height: "20px",
    textAlign: "center",
    WebkitBorderRadius: "8px",
    MozBorderRadius: "8px",
    borderRadius: "8px",
    zIndex: 999,
    color: "black",
  },

  tabCloseIconOnHover: {
    filter: "none",
    // backgroundColor: "red",
    // border:'1px solid red',
    color: "black",
  },

  tabAddButton: {
    cursor: "pointer",
    fontFamily: "'Heebo', sans-serif",
    fontSize: "20px",
    textShadow: "rgb(255, 255, 255) 0px 1px 0px",
    position: "relative",
    width: "5px",
    height: "20px",
    marginLeft: "10px",
    marginTop: "15px",
    zIndex: 2,
    lineHeight: "18px",
    fontWeight: "100",
  },

  beforeTitle: {
    position: "absolute",
    top: "8px",
    left: "-8px",
    zIndex: 2,
  },

  afterTitle: {
    position: "absolute",
    top: "8px",
    right: "16px",
    zIndex: 2,
  },
};

export default TabStyles;
