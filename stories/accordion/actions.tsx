import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export const ActionsInAccordion = (): JSX.Element => {
  let classes = useStyles();

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={<Checkbox />}
            label="I acknowledge that I should stop the click event propagation"
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="textSecondary">
            The click event of the nested action will propagate up and expand the accordion unless you explicitly stop
            it.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-label="Expand"
          aria-controls="additional-actions2-content"
          id="additional-actions2-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={<Checkbox />}
            label="I acknowledge that I should stop the focus event propagation"
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="textSecondary">
            The focus event of the nested action will propagate up and also focus the accordion unless you explicitly
            stop it.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-label="Expand"
          aria-controls="additional-actions3-content"
          id="additional-actions3-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={<Checkbox />}
            label="I acknowledge that I should provide an aria-label on each action that I add"
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="textSecondary">
            If you forget to put an aria-label on the nested action, the label of the action will also be included in
            the label of the parent button that controls the accordion expansion.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
