import { CheckBox } from "@bigtest/interactor";

export const MaterialCheckbox = CheckBox.extend("material-ui checkbox").filters({
  indeterminate: (element) => element.dataset.indeterminate === "true",
});
