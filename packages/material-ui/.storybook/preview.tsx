import { instrument } from "@storybook/instrumenter";
import { addActionWrapper, addInteractionWrapper, ActionEvent } from "@interactors/globals";

// NOTE: Dummy call to initialize instrumenter. See: https://github.com/storybookjs/storybook/blob/next/lib/instrumenter/src/instrumenter.ts#L512
instrument({});

let topOperationRef = null;

addInteractionWrapper((interaction, next: () => Promise<T>):  => async () => {
  if (!topOperationRef) topOperationRef = operation;
  try {
    if (topOperationRef != operation) return operation;
    const instrumenter = global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__;
    await instrumenter.track(interaction.options.code(), next, [], {
      intercept: () => true,
    });
  } finally {
    if (topOperationRef == operation) topOperationRef = null;
  }
});
