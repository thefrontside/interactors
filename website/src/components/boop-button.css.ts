import { style } from "@vanilla-extract/css";
import vars from "../css/frontside-theme.css";

export const baseButton = style({
  display: "inline-block",
  border: "none",
  fontFamily: vars.fontFamily.main,
  fontSize: vars.fontSize.base,
  fontWeight: vars.fontWeights.bold,
  background: vars.colors.blue,
  color: vars.colors.white,
  borderRadius: vars.radius.md,
  padding: vars.space["xs"],
  cursor: "pointer",
});
