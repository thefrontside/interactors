import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from "jsr:@std/expect";
import { generateImports } from '../src/generate-imports.ts';
import { createInteractor, createMatcher } from '@interactors/core';
import * as core from '@interactors/core';
import { importInteractors } from '../src/import-interactors.ts';

const TextField = createInteractor('text field');
const and = createMatcher("true", () => ({
  match: (_actual: unknown) => true,
  description: () => 'and'
}))

describe('generateImports', () => {
  it('generates imports for interactors and matchers', () => {
    let imports = {
      '@interactors/core': {
        TextField,
        and
      }
    };

    let code = generateImports(importInteractors(imports));

    expect(code).toEqual(`import { TextField as TextFieldInteractor, and as andMatcher } from '@interactors/core'
const InteractorTable = {TextField: TextFieldInteractor}
const MatcherTable = {and: andMatcher}`);
  })

  it('ignore non-interactor and non-matcher objects', () => {
    let imports = {
      '@interactors/core': {
        TextField,
        and,
        someObject: {},
        someFunction: () => {},
        SomeClass: class {},
        someValue: 42,
        someString: 'hello',
        createInteractor,
        createMatcher
      }
    };

    let code = generateImports(importInteractors(imports));

    expect(code).toEqual(`import { TextField as TextFieldInteractor, and as andMatcher } from '@interactors/core'
const InteractorTable = {TextField: TextFieldInteractor}
const MatcherTable = {and: andMatcher}`);
  })

  it('generate imports with core matchers', () => {
    let imports = {
      '@interactors/core': core,
    };

    let code = generateImports(importInteractors(imports));

    expect(code).toEqual(`import { and as andMatcher, every as everyMatcher, including as includingMatcher, matching as matchingMatcher, not as notMatcher, or as orMatcher, some as someMatcher } from '@interactors/core'
const InteractorTable = {}
const MatcherTable = {and: andMatcher, every: everyMatcher, including: includingMatcher, matching: matchingMatcher, not: notMatcher, or: orMatcher, some: someMatcher}`);
  })

  it('throws error when interactor name conflicts', async () => {
    let imports = {
      '@interactors/core': { TextField },
      '@interactors/html': { TextField }
    };
    
    expect(() => {
      generateImports(importInteractors(imports));
    }).toThrow('Interactor name TextField from @interactors/html is conflicted with named import from @interactors/core');
  })

  it.skip('overrides import names', () => {
    let imports = {
      '@interactors/core': { TextField },
      '@interactors/html': { TextField }
    };

    let code = generateImports(importInteractors(imports));

    expect(code).toEqual(`import { TextField } from '@interactors/core'
import { TextField as HTMLTextField } from '@interactors/html'
const InteractorTable = {TextField, HTMLTextField}
const MatcherTable = {}`);
  })
});
