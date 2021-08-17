import { Accordion } from "@material-ui/core";
import { ActionsInAccordion } from "./actions";
import { ControlledAccordion } from "./controlled";
import { CustomizedAccordion } from "./customized";
import { DetailedAccordion } from "./detailed";
import { SimpleAccordion } from "./simple";

export default {
  component: Accordion,
  title: "Accordion",
};

export const Simple = {
  render: (): JSX.Element => <SimpleAccordion />,
};

export const Controlled = {
  render: (): JSX.Element => <ControlledAccordion />,
};

export const Customized = {
  render: (): JSX.Element => <CustomizedAccordion />,
};

export const ActionsIn = {
  render: (): JSX.Element => <ActionsInAccordion />,
};

export const Detailed = {
  render: (): JSX.Element => <DetailedAccordion />,
};
