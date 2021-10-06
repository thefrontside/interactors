import vars, {
  laptopQuery,
  darkThemeQuery,
  desktopQuery,
} from "../../css/frontside-theme.css";
import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { pageWrap } from "../../css/page.css";

const navWrap = style([
  pageWrap,
  {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: vars.space.sm,
    paddingBottom: vars.space.sm,
    position: 'sticky',
    top: 0,
    zIndex: 300,
    boxShadow: `0 1px 6px rgba(255, 255, 255, 0.5)`,
    '@media': {
      [desktopQuery]: {
        marginTop: vars.space.xs,
        borderRadius: vars.radius.md,
        paddingTop: vars.space.sm,
        paddingBottom: vars.space.sm,
      },
      [darkThemeQuery]: {
      boxShadow: `0 3px 6px rgba(0, 0, 0, 0.5)`,
      }
    }
  },
]);

const interactorsNav = style({
  backgroundImage: `linear-gradient(45deg, ${vars.colors.blue} -5%, ${vars.colors.violet}, ${vars.colors.pink} 105%)`,
})

export const navBar = styleVariants({
  'Interactors': [navWrap, interactorsNav],
  default: {
    background: 'red',
  }
});

export const navLink = style({
  fontWeight: vars.fontWeights.bold,
  fontSize: vars.fontSize.xs,
  letterSpacing: vars.letterSpacing.xs,
  color: vars.colors.white,
  display: "inline-block",
  position: "relative",
  marginLeft: vars.space.sm,

  "@media": {
    [laptopQuery]: {
      marginLeft: vars.space.md,
    },
  },
  selectors: {
    '&:hover': {
      color: vars.colors.white,
    },
  },
});

export const logoCol = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
});

globalStyle(`${logoCol} b`, {
  display: 'none',
})

export const frontsideLink = style({
  display: 'none',
  '@media': {
    [laptopQuery]: {
      display: 'inline-block',
      marginRight: vars.space.sm,
      paddingRight: vars.space.sm,
      borderRight: `1px solid ${vars.colors.black}`,
    }
  }
})

export const logoFrontside = style({
  width: '1.5rem',
})

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
