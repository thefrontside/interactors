import { instrument } from "@storybook/instrumenter";
import { addActionWrapper } from "@interactors/globals";

// NOTE: Dummy call to initialize instrumenter. See: https://github.com/storybookjs/storybook/blob/next/lib/instrumenter/src/instrumenter.ts#L512
instrument({});

addActionWrapper(
  (description, action, type) => async () =>
    global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__.track(description, action, [], {
      intercept: () => true,
    })
);
