import { globalStyle, style } from "@vanilla-extract/css";
import vars, {
  laptopQuery,
  desktopQuery,
  darkThemeQuery,
} from "./frontside-theme.css";
import './docusaurus.css';

// .interactors-hero-tabs .maybe-class-name {
//   font-weight: bold;
//   background-image: linear-gradient(45deg,#ec6999,#59aae9 95%);
//   text-align: center;
//   -webkit-background-clip: text;
//   background-clip: text;
//   -webkit-text-fill-color: transparent;
// }

// .interactors-hero-tabs .punctuation + .punctuation + .property-access {
//   color: #db95c2 !important;
//   font-weight: bold;
// }

export const heroCode = style([{
  textAlign: 'left',
  marginTop: vars.space.md,
  '@media': {
    [laptopQuery]: {
      flexShrink: 0,
      width: '50%',
      marginTop: 0,
    }
  }
}]);

globalStyle(`${heroCode} .tabs-container .tabs`, {
  marginBottom: 0,
});

globalStyle(`${heroCode} .tabs__item`, {
  borderRadius: 'var(--ifm-global-radius)',
  padding: vars.space.sm,
  paddingTop: vars.space['2xs'],
  paddingBottom: vars.space['2xs'],
});

globalStyle(`${heroCode} pre`, {
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeights.lg,
});


globalStyle(`${heroCode} .maybe-class-name`, {
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
  fontWeight: vars.fontWeights.extrabold,
  backgroundImage: `linear-gradient(90deg, ${vars.colors.pink} -20%, ${vars.colors.purple} 95%)`,
});
