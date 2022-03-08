export class NoSuchElementError extends Error {
  name = "NoSuchElementError";
}

export class AmbiguousElementError extends Error {
  name = "AmbiguousElementError";
}

export class NotAbsentError extends Error {
  name = "NotAbsentError";
}

export class FilterNotMatchingError extends Error {
  name = "FilterNotMatchingError";
}
