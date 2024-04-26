import { expectError } from 'tsd';
import { MergeObjects } from '../src/merge-objects';

type Empty = Record<never, never>;

type A = {
  a: string;
  b?: string;
}

type B = {
  a: number;
  b?: number;
}

type C = MergeObjects<A, B>;
type D = MergeObjects<B, A>;

let c: C = { a: 1, b: 2 };
let d: D = { a: "thing", b: "blah" };

// can assign a number
c.a = 4;
c.b = 4;

// cannot assign a string
expectError(c.a = "thing");
expectError(c.b = "thing");

// can assign a string
d.a = "foo";
d.b = "foo";

// cannot assign a number
expectError(d.a = 1);
expectError(d.b = 2);

let e: MergeObjects<Empty, A> = { a: "foo", b: "bar" };

e.a = "blah";

let f: MergeObjects<MergeObjects<Empty, A>, B> = { a: 123, b: 12 };

f.a = 3
