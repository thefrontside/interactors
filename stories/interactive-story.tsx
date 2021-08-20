import { Button, Grid } from "@material-ui/core";
import { ComponentStory, StoryContext } from "@storybook/react";
import { useCallback, useLayoutEffect, useState } from "react";
export const InteractiveStory = ({
  story: storyComponent,
  args,
  context,
}: {
  story: ComponentStory<any>;
  args: unknown;
  context: StoryContext;
}): JSX.Element => {
  let [isRunning, run] = useState(false);
  let [shouldRender, renderStory] = useState(true);

  let reset = useCallback(() => renderStory(false), []);

  let play = useCallback(async () => {
    try {
      run(true);
      await storyComponent.play?.();
    } catch (error) {
      // TODO Think about how to show errors
      throw error;
    } finally {
      run(false);
    }
  }, [storyComponent]);

  useLayoutEffect(() => {
    if (shouldRender == false) renderStory(true);
  }, [shouldRender]);

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <Button onClick={play} disabled={isRunning}>
          {isRunning ? "Playing" : "Play"}
        </Button>
        <Button onClick={reset}>Reset</Button>
      </Grid>

      <Grid item>{shouldRender ? storyComponent.render?.(args, context) : null}</Grid>
    </Grid>
  );
};
