import { Link as BaseLink } from "@bigtest/interactor";

export const Link = BaseLink.extend("MUI Link").selector(
  `${BaseLink().options.specification.selector as string}[class*="MuiLink-root"]`
);
