import { bigtestGlobals } from '@bigtest/globals';
import { render as rtlRender } from "@testing-library/react";
import { ReactElement } from "react";
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create } from 'jss';


 export function render(element: ReactElement) {
    const jss = create({
      ...jssPreset(),
      // Defines a custom insertion point that JSS will look for when injecting the styles into the DOM.
      // Bigtest make an Iframe used to run the test and in order to get the
      // Material UI styles into the Iframe so the styles will be applied.
      insertionPoint: bigtestGlobals.document.head
    });

    return rtlRender(<StylesProvider jss={jss} injectFirst>{element}</StylesProvider>, {
      container: bigtestGlobals.document.body
    });
  }
