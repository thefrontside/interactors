import "date-fns";
import { ComponentProps, ComponentType, ReactElement, useState } from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface WrapperProps<CT extends ComponentType<any>> {
  getProps?: Partial<ComponentProps<CT>> | ((props?: Partial<ComponentProps<CT>>) => Partial<ComponentProps<CT>>);
  props?: Partial<ComponentProps<CT>>;
  children: (props?: Partial<ComponentProps<CT>>) => ReactElement<ComponentProps<CT>, CT>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function renderComponent<CT extends ComponentType<any>>(
  Component: CT,
  defaultProps: Partial<ComponentProps<CT>> = {},
  Wrapper: ComponentType<WrapperProps<CT>> = ({ getProps, children }) =>
    children(typeof getProps == "function" ? getProps() : getProps)
) {
  return (getProps?: WrapperProps<CT>["getProps"]) => (
    <Wrapper getProps={getProps} props={typeof getProps == "function" ? getProps() : getProps}>
      {(props) => <Component {...({ ...defaultProps, ...props } as ComponentProps<CT>)} />}
    </Wrapper>
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function renderPickerComponent<T extends ComponentType<any>>(PickerComponent: T) {
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
        {/* @ts-expect-error the component generic doesn't fit properly */}
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

  let component = renderComponent(PickerComponent, {}, Wrapper);
  return (
    getProps?:
      | Partial<ComponentProps<typeof PickerComponent>>
      | ((onChange?: (date: Date) => void) => Partial<ComponentProps<typeof PickerComponent>>)
  ) => component(typeof getProps == "function" ? ({ onChange } = {}) => getProps(onChange) : getProps);
}
