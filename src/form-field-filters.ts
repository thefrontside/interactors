// TODO Reuse it in Select
// TODO Use TextField component for select tests
export const createFormFieldFilters = <E extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>() => ({
  valid: (element: E) => !element.labels?.[0].classList.contains("Mui-error"),
  required: (element: E) => element.required,
  description: (element: E) => {
    const descriptionId = element.getAttribute("aria-describedby");
    const descriptionElement = descriptionId ? element.ownerDocument.getElementById(descriptionId) : null;
    return descriptionElement?.innerText ?? "";
  },
});
