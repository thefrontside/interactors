/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InteractorConstructor, TMatcher, TInteractor, TInteraction, Matcher, Interactor } from '@interactors/core';

type Result<T, TError extends { name: string; message: string } = { name: string; message: string }> =
  | { ok: true; value?: T }
  | { ok: false; error: TError };

function ok<TError extends { name: string; message: string }>(): Result<void, TError>;
function ok<T>(value: T): Result<T>;
function ok<T>(value?: T): Result<T> {
  if (typeof value === 'undefined') {
    return { ok: true } as Result<T>;
  } else {
    return { ok: true, value } as Result<T>;
  }
}

function err<T, TError extends { name: string; message: string } = { name: string; message: string }>(
  error: TError
): Result<T, TError> {
  return { ok: false, error };
}


declare global {
  interface Window {
    interactorAgent: {
      run(interaction: TInteraction): Promise<Result<void, Error>>;
      interactors: Record<string, InteractorConstructor<any, any, any, any>>;
      matchers: Record<string, (...args: unknown[]) => Matcher<unknown>>;
    };
  }
}

// NOTE: esbuild iief format doesn't support top-level await
;(async () => {
  const { InteractorTable, MatcherTable } = await (await import('./interactors')).getImports()

  window.interactorAgent = {
    interactors: InteractorTable,
    matchers: MatcherTable,
    run: async (interaction: TInteraction) => {
      try {
        let [start, ...rest] = interaction.path.map(lookup);
        let interactor = rest.reduce((i, curr) => i.find(curr), start);
        // @ts-expect-error hope interactor has a method with this name
        await interactor[interaction.name](...interaction.args.map(handleArg));
        return ok();
      } catch (error) {
        // TODO Add additional info, like interaction
        if (typeof error === 'string') {
          return err({ name: 'InteractionError', message: error });
        } else {
          return err(error as Error);
        }
      }
    }
  }
})()

function lookup(segment: Omit<TInteractor<unknown>, "ancestors">): Interactor<any, any> {
  let constructor = window.interactorAgent.interactors[segment.typename];
  if (!constructor) {
    let error = new Error(segment.typename);
    error.name = `NoSuchInteractorError`;
    throw error;
  }
  if (typeof constructor !== 'function') {
    let error = new Error(
      `expected ${segment.typename} interactor constructor to be a function, but was ${JSON.stringify(
        constructor
      )}`
    );
    error.name = `TypeError`;
    throw error;
  }
  let filter = segment.match ? rematchObject(segment.match) : undefined;
  let locator = isMatcher(segment.locator) ? rematch(segment.locator) : segment.locator;
  return constructor(...[locator, filter].filter(Boolean));
}

function isMatcher(value: unknown): value is TMatcher<unknown> {
  return typeof value === 'object' && !!value && 'typename' in value && typeof value.typename === 'string'
}

function rematch(matcher: TMatcher<unknown>): Matcher<unknown> {
  let matchFn = window.interactorAgent.matchers[matcher.typename];
  if (!matchFn) {
    let error = new Error(matcher.typename);
    error.name = `NoSuchMatcherError`;
    throw error;
  }
  return matchFn(...matcher.args.map(arg => isMatcher(arg) ? rematch(arg) : arg) as unknown[]);
}

function rematchObject(arg: Record<string, unknown>) {
  let result = {} as Record<string, unknown>;
  for (let key in arg) {
    result[key] = isMatcher(arg[key]) ? rematch(arg[key] as TMatcher<unknown>) : arg[key];
  }
  return result;
}

function handleArg(arg: unknown) {
  if (Array.isArray(arg) || arg === null || typeof arg !== 'object') {
    // NOTE: It's action's argument
    return arg;
  }
  return rematchObject(arg as Record<string, unknown>);
}
