import { instrument } from "@storybook/instrumenter";
import { addInteractionWrapper, globals, setInteractorScope } from "@interactors/globals";

// NOTE: Dummy call to initialize instrumenter. See: https://github.com/storybookjs/storybook/blob/next/lib/instrumenter/src/instrumenter.ts#L512
instrument({});

let isRoot = true;

addInteractionWrapper((interaction, next) => {
  if (!isRoot) {
    return next;
  }
  return async () => {
    const cancel = (event) => {
      if (!event.newPhase || event.newPhase == "aborted" || event.newPhase == "errored") {
        __STORYBOOK_ADDONS_CHANNEL__.off("forceRemount", cancel);
        __STORYBOOK_ADDONS_CHANNEL__.off("storyRenderPhaseChanged", cancel);
        interaction.catchHalt();
        interaction.halt();
        isRoot = true;
      }
    };
    __STORYBOOK_ADDONS_CHANNEL__.on("forceRemount", cancel);
    __STORYBOOK_ADDONS_CHANNEL__.on("storyRenderPhaseChanged", cancel);
    try {
      return await global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__.track(
        interaction.options.code(),
        next,
        [],
        {
          intercept: () => !(isRoot = false),
        }
      );
    } finally {
      isRoot = true;
      __STORYBOOK_ADDONS_CHANNEL__.off("forceRemount", cancel);
      __STORYBOOK_ADDONS_CHANNEL__.off("storyRenderPhaseChanged", cancel);
    }
  };
});
