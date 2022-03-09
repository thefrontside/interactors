import { instrument } from "@storybook/instrumenter";
import { addInteractionWrapper } from "@interactors/globals";

// NOTE: Dummy call to initialize instrumenter. See: https://github.com/storybookjs/storybook/blob/next/lib/instrumenter/src/instrumenter.ts#L512
instrument({});

let topOperationRef = null;

addInteractionWrapper((interaction, next: () => Promise<unknown>) => async () => {
  if (!topOperationRef) topOperationRef = next;
  try {
    if (topOperationRef != next) return next();
    let result;
    const cancel = () => interaction.halt()
    __STORYBOOK_ADDONS_CHANNEL__.once('setCurrentStory', cancel)
    const instrumenter = global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__;
    await instrumenter.track(interaction.options.code(), async () => {
      result = await next()
      return result
    }, [], {
      intercept: () => true,
    });
    __STORYBOOK_ADDONS_CHANNEL__.off('setCurrentStory', cancel)
    return result;
  } finally {
    if (topOperationRef == next) topOperationRef = null;
  }
});
