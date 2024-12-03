export class NoSuchElementError extends Error {
  override name = "NoSuchElementError";
}

export class AmbiguousElementError extends Error {
  override name = "AmbiguousElementError";
}

export class NotAbsentError extends Error {
  override name = "NotAbsentError";
}

export class FilterNotMatchingError extends Error {
  override name = "FilterNotMatchingError";
}
