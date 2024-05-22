import { describe, it } from 'jsr:@std/testing/bdd';
import { expect } from "jsr:@std/expect";
import { generateImports } from '../src/generate.ts';
import { createInteractor, createMatcher } from '@interactors/core';
import * as core from '@interactors/core';

const TextField = createInteractor('text field');
const and = createMatcher(() => ({
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

    let code = generateImports(imports);

    expect(code).toEqual(`import { TextField, and } from '@interactors/core'
const InteractorTable = {TextField}
const MatcherTable = {and}`);
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

    let code = generateImports(imports);

    expect(code).toEqual(`import { TextField, and } from '@interactors/core'
const InteractorTable = {TextField}
const MatcherTable = {and}`);
  })

  it('generate imports with core matchers', () => {
    let imports = {
      '@interactors/core': core,
    };

    let code = generateImports(imports);

    expect(code).toEqual(`import { including, matching, and, or, not, some, every } from '@interactors/core'
const InteractorTable = {}
const MatcherTable = {including, matching, and, or, not, some, every}`);
  })

  it('throws error when interactor name conflicts', () => {
    let imports = {
      '@interactors/core': { TextField },
      '@interactors/html': { TextField }
    };

    expect(() => {
      generateImports(imports);
    }).toThrowError('Interactor name TextField from @interactors/html is conflicted with named import from @interactors/core');
  })

  it('overrides import names', () => {
    let imports = {
      '@interactors/core': { TextField },
      '@interactors/html': { TextField }
    };

    let code = generateImports(imports, {
      overrides: (moduleName, name) => moduleName === '@interactors/html' ? `HTML${name}` : name
    });

    expect(code).toEqual(`import { TextField } from '@interactors/core'
import { TextField as HTMLTextField } from '@interactors/html'
const InteractorTable = {TextField, HTMLTextField}
const MatcherTable = {}`);
  })
});
