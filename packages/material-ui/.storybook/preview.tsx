import Events from "@storybook/core-events";
import { addons } from "@storybook/addons";
import { instrument } from "@storybook/instrumenter";
import { addInteractionWrapper } from "@interactors/globals";

// NOTE: Dummy call to initialize instrumenter. See: https://github.com/storybookjs/storybook/blob/next/lib/instrumenter/src/instrumenter.ts#L512
instrument({});

let isRoot = true;

addInteractionWrapper((perform, interaction) => {
  if (!isRoot) {
    return perform;
  }
  return async () => {
    const channel = addons.getChannel();
    const cancel = (event) => {
      if (!event.newPhase || event.newPhase == "aborted" || event.newPhase == "errored") {
        channel.off(Events.FORCE_REMOUNT, cancel);
        channel.off(Events.STORY_RENDER_PHASE_CHANGED, cancel);
        interaction.halt();
        isRoot = true;
      }
    };
    channel.on(Events.FORCE_REMOUNT, cancel);
    channel.on(Events.STORY_RENDER_PHASE_CHANGED, cancel);
    try {
      return await global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__.track(
        interaction.code(),
        perform,
        [],
        { intercept: () => !(isRoot = false) }
      );
    } finally {
      isRoot = true;
      channel.off(Events.FORCE_REMOUNT, cancel);
      channel.off(Events.STORY_RENDER_PHASE_CHANGED, cancel);
    }
  };
});
