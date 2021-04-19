import "date-fns";
import { bigtestGlobals } from "@bigtest/globals";
import { render as rtlRender } from "@testing-library/react";
import { ComponentProps, ComponentType, ReactElement, useState } from "react";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { create } from "jss";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export function render(element: ReactElement) {
  return {
    description: "render",
    action: () => {
      let insertion = document.createComment("mui-jss-insertion");
      let insertionPoint = document.head.insertBefore(insertion, document.head.firstChild);
      const jss = create({
        ...jssPreset(),
        // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
        insertionPoint,
      });

      rtlRender(
        <StylesProvider jss={jss} injectFirst>
          {element}
        </StylesProvider>,
        {
          container: document.body,
        }
      );
    },
  };
}

type HTMLTypes<T> = T extends `HTML${infer C}Element` ? C : never;

type HTMLElementTypes = HTMLTypes<keyof typeof window>;

export function isHTMLElement<T extends HTMLElementTypes = "">(
  element: unknown | null | undefined,
  type: T = "" as T
): element is InstanceType<typeof window[`HTML${T}Element`]> {
  const { defaultView } = bigtestGlobals.document;
  const Constructor = (defaultView as any)?.[`HTML${type}Element`];
  return typeof Constructor == "function" && element instanceof Constructor;
}

export interface WrapperProps<CT extends ComponentType<any>> {
  getProps?: Partial<ComponentProps<CT>> | ((props?: Partial<ComponentProps<CT>>) => Partial<ComponentProps<CT>>);
  props?: Partial<ComponentProps<CT>>;
  children: (props?: Partial<ComponentProps<CT>>) => ReactElement<ComponentProps<CT>, CT>;
}

export function getComponentRenderer<CT extends ComponentType<any>>(
  Component: CT,
  defaultProps: Partial<ComponentProps<CT>> = {},
  Wrapper: ComponentType<WrapperProps<CT>> = ({ getProps, children }) =>
    children(typeof getProps == "function" ? getProps() : getProps)
) {
  return (getProps?: WrapperProps<CT>["getProps"]) =>
    render(
      <Wrapper getProps={getProps} props={typeof getProps == "function" ? getProps() : getProps}>
        {(props) => <Component {...({ ...defaultProps, ...props } as ComponentProps<CT>)} />}
      </Wrapper>
    );
}

export function getPickerRenderer<T extends ComponentType<any>>(PickerComponent: T) {
  const Wrapper = ({ getProps, children }: WrapperProps<T>) => {
    const props = typeof getProps == "function" ? getProps() : getProps;
    const initialDate = (props?.date ?? new Date("2014-08-18")) as Date;
    const [dateValue, _timeValue] = initialDate
      .toISOString()
      .replace(/\.\d{3}Z$/, "")
      .split("T");
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {/* @ts-expect-error just ignore it */}
        {children({
          onChange: setSelectedDate,
          date: selectedDate,
          value: selectedDate,
          id: dateValue,
          label: dateValue,
          ...(typeof getProps == "function"
            ? getProps(
                // @ts-expect-error
                { onChange: setSelectedDate }
              )
            : getProps),
        })}
      </MuiPickersUtilsProvider>
    );
  };

  const renderComponent = getComponentRenderer(PickerComponent, {}, Wrapper);
  return (
    getProps?:
      | Partial<ComponentProps<typeof PickerComponent>>
      | ((onChange?: (date: Date) => void) => Partial<ComponentProps<typeof PickerComponent>>)
  ) => renderComponent(typeof getProps == "function" ? ({ onChange } = {}) => getProps(onChange) : getProps);
}
