import vars, {
  laptopQuery,
  darkThemeQuery,
  colorValues,
} from "../../css/frontside-theme.css";
import { style } from "@vanilla-extract/css";
// import { pageWrap } from "../../styles/page.css";
// import gradientDecor from "../../img/q3-2021/button-gradient.png";

export const navWrap = style([
  //   pageWrap,
  {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "center",
    justifyContent: "flex-end",
  },
]);

// export const contactButton = style({
//   display: "inline-block",
//   background: `url(${gradientDecor}) no-repeat right bottom, linear-gradient(90deg, ${vars.colors.violet}, ${vars.colors.pink} 120%)`,
//   backgroundSize: "contain, cover",
//   fontWeight: vars.fontWeights.bold,
//   fontSize: vars.fontSize.xs,
//   color: vars.colors.white,
//   textTransform: "uppercase",
//   paddingRight: vars.space["2xs"],
//   paddingLeft: vars.space["2xs"],
//   paddingTop: vars.space["3xs"],
//   paddingBottom: vars.space["3xs"],
//   borderRadius: vars.radius.md,
//   letterSpacing: vars.letterSpacing.xl,
//   marginLeft: vars.space.md,
//   order: 3,
// });

export const navLink = style({
  fontWeight: vars.fontWeights.bold,
  fontSize: vars.fontSize.xs,
  letterSpacing: vars.letterSpacing.xs,
  color: vars.colors.blue,
  display: "inline-block",
  position: "relative",

  "@media": {
    [darkThemeQuery]: {
      color: vars.colors.white,
    },
    [laptopQuery]: {
      marginLeft: vars.space.md,
    },
  },
  selectors: {
    '&[aria-current="page"]:before': {
      display: "block",
      content: '" "',
      position: "absolute",
      bottom: "-0.2rem",
      left: 0,
      width: "100%",
      height: "0.105rem",
      background: `linear-gradient(90deg, ${colorValues.skyblue}, ${colorValues.violet}, ${colorValues.pink} 95%)`,
      borderRadius: vars.radius.md,
    },
    "&:first-child": {
      "@media": {
        [laptopQuery]: {
          display: "none",
        },
      },
    },
  },
});

export const logoMargin = style({
  marginRight: "auto",
  order: 1,
});

export const logoSVGFill = style({
  fill: vars.colors.blue,
  "@media": {
    [darkThemeQuery]: {
      fill: vars.colors.white,
    },
  },
});

export const linksGroup = style({
  display: "flex",
  width: "100%",
  order: 4,
  justifyContent: "space-between",
  marginTop: vars.space.md,

  "@media": {
    [laptopQuery]: {
      order: 2,
      width: "auto",
      marginTop: 0,
    },
  },
});
