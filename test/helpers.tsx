import { bigtestGlobals } from "@bigtest/globals";
import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { create } from "jss";

export function render(element: ReactElement) {
  let insertion = bigtestGlobals.document.createComment("mui-jss-insertion");
  let insertionPoint = bigtestGlobals.document.head.insertBefore(insertion, bigtestGlobals.document.head.firstChild);
  const jss = create({
    ...jssPreset(),
    // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
    insertionPoint,
  });

  return rtlRender(
    <StylesProvider jss={jss} injectFirst>
      {element}
    </StylesProvider>,
    {
      container: bigtestGlobals.document.body,
    }
  );
}
