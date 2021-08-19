import { Button, Grid } from "@material-ui/core";
import { ComponentStory, StoryContext } from "@storybook/react";
import { useCallback, useState } from "react";
export const InteractiveStory = ({
  story,
  args,
  context,
}: {
  story: ComponentStory<any>;
  args: unknown;
  context: StoryContext;
}): JSX.Element => {
  let [isRunning, run] = useState(false);
  let [key, setKey] = useState(Math.random().toString());

  let reset = useCallback(() => setKey(Math.random().toString()), []);

  let play = useCallback(async () => {
    try {
      run(true);
      await story.play?.();
    } catch (error) {
      // TODO Think about how to show errors
      throw error;
    } finally {
      run(false);
    }
  }, [story]);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Button onClick={play} disabled={isRunning}>
          {isRunning ? "Playing" : "Play"}
        </Button>
        <Button onClick={reset}>Reset</Button>
      </Grid>

      <Grid item key={key}>
        {story.render?.(args, context)}
      </Grid>
    </Grid>
  );
};
