import "date-fns";
import { render as rtlRender } from "@testing-library/react";
import { ComponentProps, ComponentType, ReactElement, useState } from "react";
import { ThemeProvider, jssPreset, StylesProvider, createTheme } from "@material-ui/core";
import { create } from "jss";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

interface StepImplementation {
  description: string;
  action: () => void;
}

export function render(description: ReactElement): StepImplementation;
export function render(description: string, element: ReactElement): StepImplementation;
export function render(description: string | ReactElement, element?: ReactElement): StepImplementation {
  if (typeof description != "string") {
    element = description;
    description = typeof element.type == "string" ? element.type : element.type.name || "render unknown element";
  }
  let purple = createTheme({ palette: { primary: { main: "#800080" } } });
  let green = createTheme({ palette: { primary: { main: "#008000" } } });
  return {
    description,
    action: () => {
      let insertion = document.createComment("mui-jss-insertion");
      let insertionPoint = document.head.insertBefore(insertion, document.head.firstChild);
      let jss = create({
        ...jssPreset(),
        // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
        insertionPoint,
      });

      rtlRender(
        // NOTE We have to use nested themes to make material-ui generates classnames with ids
        <ThemeProvider theme={purple}>
          <ThemeProvider theme={green}>
            <StylesProvider jss={jss} injectFirst>
              {element}
            </StylesProvider>
          </ThemeProvider>
        </ThemeProvider>,
        {
          container: document.body,
        }
      );
    },
  };
}

// FIXME There is issue with getting name from component that is wrapped in `withStyles`
function getDisplayName(Component: ComponentType | string) {
  return (
    (typeof Component === "string"
      ? Component
      : Component.displayName || Component.name || (Component as { muiName?: string }).muiName) || "Unknown"
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WrapperProps<CT extends ComponentType<any>> {
  getProps?: Partial<ComponentProps<CT>> | ((props?: Partial<ComponentProps<CT>>) => Partial<ComponentProps<CT>>);
  props?: Partial<ComponentProps<CT>>;
  children: (props?: Partial<ComponentProps<CT>>) => ReactElement<ComponentProps<CT>, CT>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRenderStep<CT extends ComponentType<any>>(
  Component: CT,
  defaultProps: Partial<ComponentProps<CT>> = {},
  Wrapper: ComponentType<WrapperProps<CT>> = ({ getProps, children }) =>
    children(typeof getProps == "function" ? getProps() : getProps)
) {
  return (getProps?: WrapperProps<CT>["getProps"]): StepImplementation =>
    render(
      `render component '${getDisplayName(Component)}'`,
      <Wrapper getProps={getProps} props={typeof getProps == "function" ? getProps() : getProps}>
        {(props) => <Component {...({ ...defaultProps, ...props } as ComponentProps<CT>)} />}
      </Wrapper>
    );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function createPickerRenderStep<T extends ComponentType<any>>(PickerComponent: T) {
  let Wrapper = ({ getProps, children }: WrapperProps<T>) => {
    let props = typeof getProps == "function" ? getProps() : getProps;
    let initialDate = (props?.date ?? new Date("2014-08-18")) as Date;
    let [dateValue] = initialDate
      .toISOString()
      .replace(/\.\d{3}Z$/, "")
      .split("T");
    let [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {children({
          onChange: setSelectedDate,
          date: selectedDate,
          value: selectedDate,
          id: dateValue,
          label: dateValue,
          ...(typeof getProps == "function"
            ? getProps(
                // @ts-expect-error the component generic doesn't fit properly
                { onChange: setSelectedDate }
              )
            : getProps),
        })}
      </MuiPickersUtilsProvider>
    );
  };

  let renderComponent = createRenderStep(PickerComponent, {}, Wrapper);
  return (
    getProps?:
      | Partial<ComponentProps<typeof PickerComponent>>
      | ((onChange?: (date: Date) => void) => Partial<ComponentProps<typeof PickerComponent>>)
  ) => renderComponent(typeof getProps == "function" ? ({ onChange } = {}) => getProps(onChange) : getProps);
}
