import { instrument } from "@storybook/instrumenter";
import { addActionWrapper, InteractorOptions } from "@interactors/globals";

// NOTE: Dummy call to initialize instrumenter. See: https://github.com/storybookjs/storybook/blob/next/lib/instrumenter/src/instrumenter.ts#L512
instrument({});

let topActionRef = null;

addActionWrapper((_description, action, _type, options) => async () => {
  if (!topActionRef) topActionRef = action;
  try {
    if (topActionRef != action) return action();
    const instrumenter = global.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__;
    const { actionName } = options;
    let find = (r) => r;

    for (const ancestor of options.ancestors ?? []) {
      ({ find } = find(
        instrumenter.track(
          ancestor.name,
          () => ({ find: (r) => r }),
          ancestor.locator ? [ancestor.locator, ancestor.filter] : [ancestor.filter],
          { intercept: () => true }
        )
      ));
    }
    const { [actionName]: wrappedAction } = find(
      instrumenter.track(
        options.name,
        () => ({ [actionName]: action }),
        options.locator ? [options.locator, options.filter] : [options.filter],
        { intercept: () => true }
      )
    );

    await wrappedAction(...options.args);
  } finally {
    if (topActionRef == action) topActionRef = null;
  }
});
