import { HTML, innerText } from "@interactors/html";
import { isDefined } from "./helpers";

function isDisabled(element: Element) {
  return element.className.includes("Mui-disabled");
}

export type SliderOrientation = "horizontal" | "vertical";

function getThumbs(element: HTMLElement) {
  return Array.from(element.querySelectorAll('[class*="MuiSlider-thumb"]'));
}

function getThumb(element: HTMLElement) {
  return getThumbs(element)[0] ?? null;
}

function parseValue(stringValue?: string | null) {
  let value = stringValue ? parseInt(stringValue) : NaN;
  return Number.isNaN(value) ? undefined : value;
}

export const Thumb = HTML.extend<HTMLElement>("MUISliderThumb")
  .locator((element) => element.getAttribute("aria-label") ?? element.getAttribute("aria-valuetext") ?? "")
  .selector('[role="slider"][class*="MuiSlider-thumb"]')
  .filters({
    // NOTE: Do we need other filters like, min/max value, orientation? They are the same for each thumb in Slider
    index: (element) => parseValue(element.getAttribute("data-index")),
    value: (element) => parseValue(element.getAttribute("aria-valuenow")),
    textValue: (element) => element.getAttribute("aria-valuetext"),
    min: (element) =>
      parseValue(element.getAttribute("aria-valuenow")) == parseValue(element.getAttribute("aria-valuemin")),
    max: (element) =>
      parseValue(element.getAttribute("aria-valuenow")) == parseValue(element.getAttribute("aria-valuemax")),
    disabled: {
      // NOTE: The Slider doesn't have `aria-disabled` attribute https://github.com/mui-org/material-ui/issues/27031
      apply: isDisabled,
      default: false,
    },
  })
  .actions({
    decrease: ({ perform }, steps = 1) =>
      perform((element) => {
        if (isDisabled(element)) return;

        element.focus();

        Array.from({ length: steps }).forEach(() =>
          document.activeElement?.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true })
          )
        );
      }),
    increase: ({ perform }, steps = 1) =>
      perform((element) => {
        if (isDisabled(element)) return;

        element.focus();

        Array.from({ length: steps }).forEach(() =>
          document.activeElement?.dispatchEvent(
            new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })
          )
        );
      }),
    setMin: ({ perform }) =>
      perform((element) => {
        if (isDisabled(element)) return;
        element.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
      }),
    setMax: ({ perform }) =>
      perform((element) => {
        if (isDisabled(element)) return;
        element.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
      }),
    setValue: ({ description, perform }, value: number) =>
      perform((element) => {
        if (isDisabled(element)) return;

        let minValue = parseValue(element.getAttribute("aria-valuemin"));
        let maxValue = parseValue(element.getAttribute("aria-valuemax"));
        let orientation = element.getAttribute("aria-orientation") as SliderOrientation | null;

        if (!minValue || !maxValue || !orientation) throw new Error(`Can't set value ${value} for ${description}`);

        let valuePercent = Math.min(1, Math.max(0, (value - minValue) / (maxValue - minValue)));
        let rail = element.parentElement?.querySelector('[class*="MuiSlider-rail"]');
        let { left = 0, top = 0 } = rail?.getBoundingClientRect() ?? {};
        let thumbRect = element.getBoundingClientRect();

        rail?.dispatchEvent(
          new MouseEvent("mousedown", {
            clientX: Math.round(thumbRect.left + thumbRect.width / 2),
            clientY: Math.round(thumbRect.top + thumbRect.height / 2),
            bubbles: true,
            cancelable: true,
          })
        );
        rail?.dispatchEvent(
          new MouseEvent("mousemove", {
            ...(orientation == "horizontal"
              ? { clientX: Math.round(left + valuePercent * rail.clientWidth) }
              : { clientY: Math.round(top + (1 - valuePercent) * rail.clientHeight) }),
            bubbles: true,
            cancelable: true,
          })
        );
        rail?.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true }));
      }),
  });

const SliderInteractor = HTML.extend("MUISlider")
  .selector('[class*="MuiSlider-root"]')
  .locator((element) => {
    let thumb = getThumb(element);
    let labelId = thumb?.getAttribute("aria-labelledby");
    let label = labelId ? document.getElementById(labelId) : null;
    return label ? innerText(label) : thumb.getAttribute("aria-label") ?? "";
  })
  .filters({
    orientation: (element) => getThumb(element)?.getAttribute("aria-orientation") as SliderOrientation | null,
    horizontal: (element) => getThumb(element)?.getAttribute("aria-orientation") == "horizontal",
    vertical: (element) => getThumb(element)?.getAttribute("aria-orientation") == "vertical",
    minValue: (element) => parseValue(getThumb(element)?.getAttribute("aria-valuemin")),
    maxValue: (element) => parseValue(getThumb(element)?.getAttribute("aria-valuemax")),
    value: (element) => {
      let thumbs = getThumbs(element);
      if (thumbs.length == 0) return;
      if (thumbs.length == 1) return parseValue(thumbs[0].getAttribute("aria-valuenow"));
      return thumbs.map((thumb) => parseValue(thumb.getAttribute("aria-valuenow"))).filter(isDefined);
    },
    textValue: (element) => {
      let thumbs = getThumbs(element);
      if (thumbs.length == 0) return;
      if (thumbs.length == 1) return thumbs[0].getAttribute("aria-valuetext");
      return thumbs.map((thumb) => thumb.getAttribute("aria-valuetext")).filter(isDefined);
    },
    min: (element) =>
      getThumbs(element).every(
        (thumb) => parseValue(thumb.getAttribute("aria-valuenow")) == parseValue(thumb.getAttribute("aria-valuemin"))
      ),
    max: (element) =>
      getThumbs(element).every(
        (thumb) => parseValue(thumb.getAttribute("aria-valuenow")) == parseValue(thumb.getAttribute("aria-valuemax"))
      ),
    disabled: {
      // NOTE: The Slider doesn't have `aria-disabled` attribute https://github.com/mui-org/material-ui/issues/27031
      apply: isDisabled,
      default: false,
    },
  })
  .actions({
    decrease: ({ find }, steps = 1) => find(Thumb()).decrease(steps),
    increase: ({ find }, steps = 1) => find(Thumb()).increase(steps),
    setMin: ({ find }) => find(Thumb()).setMin(),
    setMax: ({ find }) => find(Thumb()).setMax(),
    setValue: ({ find }, value: number) => find(Thumb()).setValue(value),
  });

/**
 * Call this {@link InteractorConstructor} to initialize a slider {@link Interactor}.
 * The slider interactor can be used to interact with sliders on the page and
 * to assert on their state.
 *
 * The slider is located by the label or the `aria-label` attribute.
 *
 * ### Example
 *
 * ``` typescript
 * await Slider('Submit').click();
 * await Slider('Submit').is({ disabled: true });
 * await Slider({ id: 'submit-slider', disabled: true }).exists();
 * ```
 *
 * ### Filters
 *
 * - `id`: *string* – Filter by id
 * - `visible`: *boolean* – Filter by visibility. Defaults to `true`. See {@link isVisible}.
 * - `disabled`: *boolean* – Filter by whether the slider is disabled. Defaults to `false`.
 * - `orientation`: *horizontal | vertical* - Filter by orientation
 * - `horizontal`: *boolean* - Filter by whether the slider has horizontal orientation
 * - `vertical`: *boolean* - Filter by whether the slider has vertical orientation
 * - `minValue`: *number* - Filter by the least possible value
 * - `maxValue`: *number* - Filter by the greatest possible value
 * - `value`: *number* - Filter by the current value
 * - `textValue`: *string* - Filter by the text representation of current value
 * - `min`: *boolean* - Filter by whether the slider value is equal `minValue`
 * - `max`: *boolean* - Filter by whether the slider value is equal `maxValue`
 *
 * ### Actions
 *
 * - `focus()`: *{@link Interaction}* – Move focus to the slider
 * - `blur()`: *{@link Interaction}* – Move focus away from the slider
 * - `decrease(steps: number = 1)`: *{@link Interaction}* – Decrease slider value by specific steps
 * - `increase(steps: number = 1)`: *{@link Interaction}* – Increase slider value by specific steps
 * - `setMin()`: *{@link Interaction}* - Set value to the least possible
 * - `setMax()`: *{@link Interaction}* – Set value to the greatest possible
 * - `setValue(value: number)`: *{@link Interaction}* – Set current value
 *
 * @category Interactor
 */
export const Slider = SliderInteractor;
