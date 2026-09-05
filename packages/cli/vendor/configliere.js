// Vendored from https://github.com/thefrontside/configliere/tree/7ea47ca0e3026356285f3f6f4b95f24d3a4ff7b7
// Generated with Deno 2.9.4. See README.md for reproduction details.
// Configliere is Copyright 2025-present Frontside Software, Inc. and MIT licensed.

// lib/decode.ts
var number = (value) => {
  if (!numeric.test(value)) {
    return [];
  }
  let decoded = Number(value);
  return Number.isFinite(decoded) ? [
    decoded
  ] : [];
};
var scalar = (value) => {
  return [
    ...number(value),
    value
  ];
};
var boolean = (value) => {
  if (value === "true") {
    return [
      true
    ];
  }
  if (value === "false") {
    return [
      false
    ];
  }
  return [];
};
var numeric = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

// lib/pipeline.ts
function mark(element) {
  return element;
}
function brand(element) {
  return element;
}

// lib/param.ts
function param(start, ...elements) {
  let zero = {
    ...start,
    schema: unknown,
    cli: {
      read(tokens) {
        let claim = tokens.claimAll(() => false);
        return {
          result: {
            ok: true,
            value: {
              exists: false
            },
            issues: []
          },
          claim
        };
      }
    },
    decode: scalar
  };
  return elements.reduce((value, element) => element(value), zero);
}
function schema(schema2) {
  return mark((param2) => ({
    ...param2,
    schema: schema2
  }));
}
var unknown = {
  "~standard": {
    version: 1,
    vendor: "configliere",
    validate: (value) => ({
      value
    })
  }
};

// lib/argument.ts
function argument(named, ...elements) {
  const added = elements.reduce((value, element) => element(value), param(named, positional));
  return brand((route2) => {
    let phases = [
      ...route2.phases
    ];
    let phase = phases.pop();
    phases.push({
      ...phase,
      params: {
        ...phase.params,
        [added.name]: added
      }
    });
    return {
      ...route2,
      phases
    };
  });
}
function positional(param2) {
  return {
    ...param2,
    cli: {
      read,
      syntax: {
        type: "argument",
        label: `<${param2.name.toUpperCase()}>`
      }
    }
  };
}
var read = (tokens) => {
  let claim = tokens.claimOne((token) => token.type === "word");
  let [word] = claim.tokens;
  return word ? {
    claim,
    result: {
      ok: true,
      value: {
        exists: true,
        value: word.text
      },
      issues: []
    }
  } : nothing(tokens);
};
function nothing(tokens) {
  let claim = tokens.claimAll(() => false);
  return {
    claim,
    result: {
      ok: true,
      value: {
        exists: false
      },
      issues: []
    }
  };
}

// lib/extend.ts
function extend(...elements) {
  return brand((start) => elements.reduce((value, element) => element(value), start));
}

// lib/command.ts
function command(start, ...elements) {
  let zero = {
    ...start,
    methods: [
      "help",
      "execute"
    ],
    phases: [
      {
        params: {},
        routes: [],
        values: [],
        envs: []
      }
    ]
  };
  return elements.reduce((value, element) => element(value), zero);
}

// lib/dynamic.ts
function dynamic(extension, ..._valid) {
  return brand((route2) => {
    let phases = [
      ...route2.phases
    ];
    let phase = phases.pop();
    phases.push({
      ...phase,
      resolver: extension
    });
    phases.push({
      params: {},
      routes: [],
      values: [],
      envs: []
    });
    return {
      ...route2,
      phases
    };
  });
}

// lib/values.ts
function withValues(values) {
  return brand((route2) => {
    let phases = [
      ...route2.phases
    ];
    let phase = phases.pop();
    phases.push({
      ...phase,
      values: phase.values.concat(values)
    });
    return {
      ...route2,
      phases
    };
  });
}
var Values = class _Values {
  mounts;
  claims;
  constructor(mounts = /* @__PURE__ */ new Map(), claims = /* @__PURE__ */ new Set()) {
    this.mounts = mounts;
    this.claims = claims;
  }
  mount(path, sources) {
    if (sources.length === 0) {
      return this;
    }
    const id = routeId(path);
    return new _Values(new Map([
      ...this.mounts.entries(),
      [
        id,
        (this.mounts.get(id) ?? []).concat(sources)
      ]
    ]), this.claims);
  }
  claim({ route: route2, address: address2 }) {
    let id = claimId([
      ...route2,
      ...address2
    ]);
    const nope = {
      result: {
        exists: false
      },
      rest: this
    };
    if (this.claims.has(id)) {
      return nope;
    }
    for (let end = route2.length; end >= 0; end--) {
      let mountId = routeId(route2.slice(0, end));
      let sources = this.mounts.get(mountId) ?? [];
      for (let { name: name2, value } of sources) {
        let result = find(value, [
          ...route2.slice(end),
          ...address2
        ]);
        if (result.exists) {
          let rest = new _Values(this.mounts, /* @__PURE__ */ new Set([
            ...this.claims,
            id
          ]));
          return {
            result: {
              exists: true,
              value: {
                source: name2,
                address: address2,
                value: result.value
              }
            },
            rest
          };
        }
      }
    }
    return nope;
  }
};
function routeId(address2) {
  return `/${address2.join("/")}`;
}
function claimId(address2) {
  return JSON.stringify(address2);
}
function find(value, path) {
  let current = value;
  for (let key of path) {
    if (current === null || typeof current !== "object" && typeof current !== "function" || !Object.hasOwn(current, key)) {
      return {
        exists: false
      };
    }
    current = current[key];
  }
  return {
    exists: true,
    value: current
  };
}

// lib/checkpoint.ts
function checkpoint() {
  return dynamic((values) => withValues(values));
}

// lib/definition.ts
function name(name2) {
  return {
    name: name2
  };
}
function description(description2) {
  return brand((definition) => ({
    ...definition,
    description: description2
  }));
}

// lib/env.ts
function env(key) {
  return brand((param2) => ({
    ...param2,
    env: key
  }));
}
function withEnvs(envs) {
  return brand((route2) => {
    let phases = [
      ...route2.phases
    ];
    let phase = phases.pop();
    phases.push({
      ...phase,
      envs: phase.envs.concat(envs)
    });
    return {
      ...route2,
      phases
    };
  });
}
var Envs = class _Envs {
  mounts;
  claims;
  constructor(mounts = /* @__PURE__ */ new Map(), claims = /* @__PURE__ */ new Set()) {
    this.mounts = mounts;
    this.claims = claims;
  }
  mount(path, sources) {
    if (sources.length === 0) {
      return this;
    }
    let id = routeId2(path);
    return new _Envs(new Map([
      ...this.mounts.entries(),
      [
        id,
        (this.mounts.get(id) ?? []).concat(sources)
      ]
    ]), this.claims);
  }
  claim({ route: route2, address: address2, key = envKey([
    ...route2,
    ...address2
  ]) }) {
    let id = claimId2([
      ...route2,
      ...address2
    ]);
    let nope = {
      result: {
        exists: false
      },
      rest: this
    };
    if (this.claims.has(id)) {
      return nope;
    }
    for (let end = route2.length; end >= 0; end--) {
      let mount = routeId2(route2.slice(0, end));
      let sources = this.mounts.get(mount) ?? [];
      for (let { name: name2, value } of sources) {
        if (!Object.hasOwn(value, key) || typeof value[key] === "undefined") {
          continue;
        }
        let rest = new _Envs(this.mounts, /* @__PURE__ */ new Set([
          ...this.claims,
          id
        ]));
        return {
          result: {
            exists: true,
            value: {
              source: name2,
              address: address2,
              key,
              value: value[key]
            }
          },
          rest
        };
      }
    }
    return nope;
  }
};
function routeId2(path) {
  return `/${path.join("/")}`;
}
function claimId2(address2) {
  return JSON.stringify(address2);
}
function envKey(address2) {
  return address2.map(normalize).filter(Boolean).join("_");
}
function normalize(value) {
  return value.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/[^A-Za-z\d]+/g, "_").replace(/^_+|_+$/g, "").toUpperCase();
}

// lib/read.ts
function cli(names, options = {}) {
  const read2 = (tokens) => {
    if (options.switch) {
      let s = tokens.claimOne((t) => {
        return t.type === "flag" && names.includes(t.text);
      });
      let [flag] = s.tokens;
      return flag ? {
        result: {
          ok: true,
          value: {
            exists: true,
            value: true
          },
          issues: []
        },
        claim: s
      } : nothing2(tokens);
    }
    let setter = tokens.claimOne((token2) => {
      return token2.type === "setter" && names.includes(`--${token2.nameText}`);
    });
    let [token] = setter.tokens;
    if (token) {
      return {
        claim: setter,
        result: {
          ok: true,
          value: {
            exists: true,
            value: token.valueText
          },
          issues: []
        }
      };
    }
    let pair = tokens.claimPair((name2, value2) => {
      return name2.type === "flag" && names.includes(name2.text) && value2.type === "word";
    });
    let [, value] = pair.tokens;
    if (value) {
      return {
        claim: pair,
        result: {
          ok: true,
          value: {
            exists: true,
            value: value.text
          },
          issues: []
        }
      };
    }
    let bare = tokens.claimOne((t) => {
      return t.type === "flag" && names.includes(t.text);
    });
    let [incomplete] = bare.tokens;
    if (incomplete) {
      return {
        claim: bare,
        result: {
          ok: false,
          issues: [
            {
              message: `${incomplete.text} requires a value`
            }
          ]
        }
      };
    }
    return nothing2(tokens);
  };
  return brand((param2) => ({
    ...param2,
    cli: {
      read: read2,
      syntax: {
        type: "option",
        label: options.switch ? names.join(", ") : `${names.join(", ")} <VALUE>`
      }
    }
  }));
}
function nothing2(tokenizer) {
  let claim = tokenizer.claimAll(() => false);
  return {
    claim,
    result: {
      ok: true,
      value: {
        exists: false
      },
      issues: []
    }
  };
}

// lib/option.ts
function option(named, ...elements) {
  const added = elements.reduce((value, element) => element(value), param(named, cli([
    `--${named.name}`
  ])));
  return brand((route2) => {
    let phases = [
      ...route2.phases
    ];
    let phase = phases.pop();
    phases.push({
      ...phase,
      params: {
        ...phase.params,
        [added.name]: added
      }
    });
    return {
      ...route2,
      phases
    };
  });
}

// lib/bind.ts
function fromValues(options) {
  let { param: param2, route: route2, rest } = options;
  let claim = rest.values.claim({
    route: route2,
    address: [
      param2.name
    ]
  });
  if (!claim.result.exists) {
    return {
      exists: false
    };
  }
  return {
    exists: true,
    value: {
      rest: {
        ...rest,
        values: claim.rest
      },
      result: validate(param2, claim.result.value.value, [
        param2.name
      ])
    }
  };
}
function fromEnv(options) {
  let { param: param2, route: route2, rest } = options;
  let claim = rest.envs.claim({
    route: route2,
    address: [
      param2.name
    ],
    key: param2.env
  });
  if (!claim.result.exists) {
    return {
      exists: false
    };
  }
  let value = claim.result.value.value;
  return {
    exists: true,
    value: {
      rest: {
        ...rest,
        envs: claim.rest
      },
      result: decode(param2, value, param2.decode(value), [
        param2.name
      ])
    }
  };
}
function bindPhase(options) {
  let { phase, segment } = options;
  let rest = options.rest;
  let params2 = Object.values(phase.params);
  let pending = new Map(params2.map((param2) => [
    param2.name,
    param2
  ]));
  let results = /* @__PURE__ */ new Map();
  function settle(param2, binding2) {
    rest = binding2.rest;
    results.set(param2.name, binding2.result);
    pending.delete(param2.name);
  }
  function accept(param2, attempt) {
    if (!attempt.exists) {
      return;
    }
    settle(param2, attempt.value);
  }
  while (true) {
    let horizon = first(rest.tokens, segment.range);
    let offer;
    for (let param2 of pending.values()) {
      let view = rest.tokens.view({
        range: segment.range,
        through: horizon?.index
      });
      let read2 = param2.cli.read(view);
      if (read2.result.ok && !read2.result.value.exists) {
        continue;
      }
      let index = earliest(read2.claim.tokens);
      if (!offer || index < offer.index) {
        offer = {
          param: param2,
          read: read2,
          index
        };
      }
    }
    if (!offer) {
      break;
    }
    accept(offer.param, fromRead(offer.param, offer.read, rest));
  }
  for (let source of [
    fromEnv,
    fromValues
  ]) {
    for (let param2 of pending.values()) {
      accept(param2, source({
        param: param2,
        route: segment.path,
        rest
      }));
    }
  }
  for (let param2 of pending.values()) {
    results.set(param2.name, validate(param2, void 0, [
      param2.name
    ]));
  }
  let model = {};
  let issues = [];
  let valid = true;
  for (let param2 of params2) {
    let result = results.get(param2.name);
    issues.push(...result.issues ?? []);
    if (result.ok) {
      model[param2.name] = result.value;
    } else {
      valid = false;
    }
  }
  return {
    rest,
    model,
    issues,
    valid
  };
}
function fromRead(param2, read2, rest) {
  let path = [
    param2.name
  ];
  if (!read2.result.ok) {
    return {
      exists: true,
      value: {
        rest: {
          ...rest,
          tokens: read2.claim.rest
        },
        result: read2.result
      }
    };
  }
  if (!read2.result.value.exists) {
    return {
      exists: false
    };
  }
  let value = read2.result.value.value;
  let candidates = typeof value === "string" ? param2.decode(value) : [
    value
  ];
  let result = merge(decode(param2, value, candidates, path), read2.result.issues);
  return {
    exists: true,
    value: {
      rest: {
        ...rest,
        tokens: read2.claim.rest
      },
      result
    }
  };
}
function decode(param2, value, candidates, path) {
  if (candidates.length === 0) {
    return {
      ok: false,
      issues: [
        {
          message: `unable to decode ${JSON.stringify(value)}`,
          path
        }
      ]
    };
  }
  let issues;
  for (let candidate of candidates) {
    let result = validate(param2, candidate, path);
    if (result.ok) {
      return result;
    }
    issues = issues ?? result.issues;
  }
  return {
    ok: false,
    issues: issues ?? []
  };
}
function validate(param2, value, path) {
  let validated = param2.schema["~standard"].validate(value);
  if (validated instanceof Promise) {
    return {
      ok: false,
      issues: [
        {
          message: `async schemas are not allowed`,
          path
        }
      ]
    };
  }
  if (validated.issues) {
    return {
      ok: false,
      issues: validated.issues.map((issue) => ({
        ...issue,
        message: issue.message,
        path
      }))
    };
  }
  return {
    ok: true,
    issues: [],
    value: validated.value
  };
}
function merge(result, issues) {
  if (!issues || issues.length === 0) {
    return result;
  }
  return {
    ...result,
    issues: [
      ...issues,
      ...result.issues ?? []
    ]
  };
}
function first(tokens, range) {
  for (let token of tokens.view({
    range
  })) {
    if (token.type === "word") {
      return token;
    }
  }
}
function earliest(tokens) {
  let first2 = Infinity;
  for (let token of tokens) {
    first2 = Math.min(first2, token.index);
  }
  return first2;
}

// lib/tokenize.ts
function tokenize(argv) {
  let quote = false;
  let tokens = [];
  for (let i = 0; i < argv.length; i++) {
    let index = i;
    let text = argv[i];
    if (quote) {
      tokens.push({
        type: "literal",
        index,
        text
      });
      continue;
    }
    if (text === "--") {
      tokens.push({
        type: "separator",
        index,
        text
      });
      quote = true;
      continue;
    }
    let matchSetter = setterMatch.exec(text);
    if (matchSetter?.groups) {
      let { nameText, valueText } = matchSetter.groups;
      tokens.push({
        type: "setter",
        index,
        text,
        nameText,
        valueText
      });
      continue;
    }
    let matchFlag = flagMatch.exec(text);
    if (matchFlag?.groups) {
      let { prefix, flagText } = matchFlag.groups;
      tokens.push({
        type: "flag",
        index,
        text,
        flagText,
        flagType: prefix === "-" ? "short" : "long"
      });
      continue;
    }
    tokens.push({
      type: "word",
      index,
      text
    });
  }
  return tokens;
}
var flagMatch = /^(?<prefix>--?)(?<flagText>[^-=\s][^=\s]*)$/;
var setterMatch = /^--(?<nameText>[^-=\s][^=\s]*)=(?<valueText>[\s\S]*)$/;

// lib/tokenizer.ts
var Tokenizer = class {
  tokens;
  claimed;
  constructor(tokens, claimed = /* @__PURE__ */ new Set()) {
    this.tokens = tokens;
    this.claimed = new Set(claimed);
  }
  claimNext() {
    return this.claimOne(() => true);
  }
  claimOne(match) {
    for (let token of this) {
      if (match(token)) {
        return {
          tokens: [
            token
          ],
          rest: remainder(this, [
            token.index
          ])
        };
      }
    }
    return {
      tokens: [],
      rest: this
    };
  }
  claimPair(match) {
    let previous;
    for (let token of this) {
      if (!previous) {
        previous = token;
        continue;
      }
      if (token.index === previous.index + 1 && match(previous, token)) {
        return {
          tokens: [
            previous,
            token
          ],
          rest: remainder(this, [
            previous.index,
            token.index
          ])
        };
      }
      previous = token;
    }
    return {
      tokens: [],
      rest: this
    };
  }
  claimAll(match) {
    let tokens = [];
    let claimed = /* @__PURE__ */ new Set();
    for (let token of this) {
      if (match(token)) {
        claimed.add(token.index);
        tokens.push(token);
      }
    }
    return {
      tokens,
      rest: tokens.length > 0 ? remainder(this, claimed) : this
    };
  }
  view(options) {
    return new View(this, options);
  }
  *[Symbol.iterator]() {
    for (let token of this.tokens) {
      if (!this.claimed.has(token.index)) {
        yield token;
      }
    }
  }
};
var View = class {
  source;
  options;
  constructor(source, options) {
    this.source = source;
    this.options = options;
  }
  claimNext() {
    return this.claimOne(() => true);
  }
  claimOne(match) {
    for (let token of this) {
      if (match(token)) {
        return {
          tokens: [
            token
          ],
          rest: remainder(this.source, [
            token.index
          ])
        };
      }
    }
    return {
      tokens: [],
      rest: this.source
    };
  }
  claimPair(match) {
    let previous;
    for (let token of this) {
      if (!previous) {
        previous = token;
        continue;
      }
      if (token.index === previous.index + 1 && match(previous, token)) {
        return {
          tokens: [
            previous,
            token
          ],
          rest: remainder(this.source, [
            previous.index,
            token.index
          ])
        };
      }
      previous = token;
    }
    return {
      tokens: [],
      rest: this.source
    };
  }
  claimAll(match) {
    let tokens = [];
    let claimed = /* @__PURE__ */ new Set();
    for (let token of this) {
      if (match(token)) {
        claimed.add(token.index);
        tokens.push(token);
      }
    }
    return {
      tokens,
      rest: tokens.length > 0 ? remainder(this.source, claimed) : this.source
    };
  }
  *[Symbol.iterator]() {
    let { start, end } = this.options.range;
    let { through } = this.options;
    for (let token of this.source) {
      if (token.index > start && (end === void 0 || token.index < end) && (through === void 0 || token.index <= through)) {
        yield token;
      }
    }
  }
};
function remainder(source, claimed) {
  return new Tokenizer(source.tokens, /* @__PURE__ */ new Set([
    ...source.claimed,
    ...claimed
  ]));
}

// lib/parse.ts
function parse(route2, input) {
  let tokenizer = new Tokenizer(tokenize(input.argv));
  let help = tokenizer.claimAll(flags("-h", "--help"));
  let version2 = help.rest.claimAll(flags("-v", "--version"));
  let escape = version2.rest.claimAll((t) => t.type === "separator");
  let literals = escape.rest.claimAll((t) => t.type === "literal");
  let method = "execute";
  if (help.tokens.length > 0) {
    method = "help";
  } else if (version2.tokens.length > 0) {
    method = "version";
  }
  let rest = {
    tokens: literals.rest,
    values: new Values().mount([], input.values ?? []),
    envs: new Envs().mount([], input.envs ?? [])
  };
  return resume({
    segments: [
      {
        id: "/",
        route: route2,
        phases: route2.phases,
        tokens: Array.from(rest.tokens),
        path: [],
        start: -1,
        model: {},
        issues: [],
        history: []
      }
    ],
    active: 0,
    rest,
    models: {},
    method,
    literals: literals.tokens
  });
}
function resume(state) {
  while (true) {
    state = search(state);
    let index = state.active;
    let segment = state.segments[index];
    let [phase] = segment.phases;
    state = {
      ...state,
      rest: {
        ...state.rest,
        values: state.rest.values.mount(segment.path, phase.values),
        envs: state.rest.envs.mount(segment.path, phase.envs)
      }
    };
    if (state.method !== "execute" && !phase.resolver) {
      let models2 = {
        ...state.models,
        [segment.id]: segment.model
      };
      if (index + 1 < state.segments.length) {
        state = {
          ...state,
          active: index + 1,
          models: models2
        };
        continue;
      }
      return resolve({
        ...state,
        models: models2
      }, segment);
    }
    let binding2 = bindPhase({
      phase,
      segment: {
        range: {
          start: segment.start,
          end: segment.end
        },
        path: segment.path
      },
      rest: state.rest
    });
    segment = {
      ...segment,
      model: {
        ...segment.model,
        ...binding2.model
      },
      issues: [
        ...segment.issues,
        ...binding2.issues
      ]
    };
    state = {
      ...state,
      rest: binding2.rest,
      segments: replace(state.segments, index, segment)
    };
    if (!binding2.valid) {
      let issues2 = phase.resolver ? binding2.issues : [
        ...unexpected(state, segment),
        ...binding2.issues
      ];
      return unprocessableContent(state.segments[state.segments.length - 1], issues2);
    }
    if (phase.resolver) {
      let suspended = state;
      return {
        ok: true,
        route: segment.id,
        model: binding2.model,
        resume(result) {
          if (!result.ok) {
            return unprocessableContent(segment, result.issues);
          }
          let resolver = phase.resolver;
          let continuation = resolver(result.value)(seed(segment.route));
          let phases = stitch(continuation.phases, segment.phases.slice(1));
          let history = [
            ...segment.history,
            phase
          ];
          let next = {
            ...segment,
            route: {
              ...continuation,
              phases: [
                ...history,
                ...phases
              ]
            },
            phases,
            history,
            issues: [
              ...segment.issues,
              ...result.issues ?? []
            ]
          };
          return resume({
            ...suspended,
            segments: replace(suspended.segments, index, next)
          });
        }
      };
    }
    let issues = unexpected(state, segment);
    if (issues.length > 0) {
      return unprocessableContent(state.segments[state.segments.length - 1], issues);
    }
    let id = `/${segment.path.join("/")}`;
    let models = {
      ...state.models,
      [id]: segment.model
    };
    if (index + 1 < state.segments.length) {
      state = {
        ...state,
        active: index + 1,
        models
      };
      continue;
    }
    return resolve({
      ...state,
      models
    }, segment);
  }
}
function search(state) {
  let segments = [
    ...state.segments
  ];
  let rest = state.rest;
  while (true) {
    let index = segments.length - 1;
    let segment = segments[index];
    let [phase] = segment.phases;
    let remaining = new Set(Array.from(rest.tokens, (token) => token.index));
    let selector = segment.tokens.find((token) => {
      return remaining.has(token.index) && token.type === "word" && phase.routes.some((route2) => route2.name === token.text);
    });
    if (!selector) {
      return {
        ...state,
        segments,
        rest
      };
    }
    let child = phase.routes.find((route2) => route2.name === selector.text);
    let path = [
      ...segment.path,
      child.name
    ];
    let before = segment.tokens.filter((token) => token.index < selector.index);
    let after = segment.tokens.filter((token) => token.index > selector.index);
    segments[index] = {
      ...segment,
      tokens: before,
      end: selector.index
    };
    segments.push({
      id: `/${path.join("/")}`,
      route: child,
      path,
      phases: child.phases,
      tokens: after,
      start: selector.index,
      model: {},
      issues: [],
      history: []
    });
    rest = {
      ...rest,
      tokens: rest.tokens.claimOne((token) => token.index === selector.index).rest
    };
  }
}
function flags(...texts) {
  return (token) => token.type === "flag" && texts.includes(token.text);
}
function stitch(before, after) {
  if (after.length === 0) {
    return before;
  }
  let phases = [
    ...before
  ];
  let phase = phases.pop();
  let [next, ...rest] = after;
  phases.push({
    ...phase,
    ...next,
    params: {
      ...phase.params,
      ...next.params
    },
    routes: [
      ...phase.routes,
      ...next.routes
    ],
    values: [
      ...phase.values,
      ...next.values
    ],
    envs: [
      ...phase.envs,
      ...next.envs
    ]
  });
  phases.push(...rest);
  return phases;
}
function resolve(state, segment) {
  let route2 = `/${segment.path.join("/")}`;
  let definition = segment.route;
  if (!definition.methods.includes(state.method)) {
    return {
      ok: false,
      code: "method-not-allowed",
      route: route2,
      definition,
      path: segment.path,
      method: state.method,
      allowed: definition.methods
    };
  }
  let intent = {
    ok: true,
    route: route2,
    definition,
    path: segment.path,
    literals: state.literals
  };
  switch (state.method) {
    case "help":
      return {
        ...intent,
        method: "help"
      };
    case "version":
      return {
        ...intent,
        method: "version"
      };
    case "execute":
      return {
        ...intent,
        method: "execute",
        model: state.models[route2],
        models: state.models,
        issues: state.segments.flatMap((segment2) => segment2.issues)
      };
  }
}
function seed(route2) {
  return {
    ...route2,
    phases: [
      {
        params: {},
        routes: [],
        values: [],
        envs: []
      }
    ]
  };
}
function replace(items, index, value) {
  let result = [
    ...items
  ];
  result[index] = value;
  return result;
}
function unprocessableContent(segment, issues) {
  return {
    ok: false,
    code: "unprocessable-content",
    route: segment.id,
    definition: segment.route,
    path: segment.path,
    issues: [
      ...issues
    ]
  };
}
function unexpected(state, segment) {
  let members = new Set(segment.tokens.map((token) => token.index));
  return Array.from(state.rest.tokens).filter((token) => members.has(token.index)).map((token) => ({
    message: `unexpected ${JSON.stringify(token.text)}`
  }));
}

// lib/print.ts
function printHelp(intent) {
  let route2 = intent.definition;
  let subject = title(intent);
  let heading = route2.version ? `${subject} ${route2.version}` : subject;
  let children = route2.phases.flatMap((phase) => phase.routes);
  let args = [];
  let options = [];
  for (let param2 of params(route2)) {
    let syntax = param2.cli.syntax;
    if (!syntax) {
      continue;
    }
    let row = [
      syntax.label,
      param2.description
    ];
    if (syntax.type === "argument") {
      args.push(row);
    } else {
      options.push(row);
    }
  }
  let usage = [
    subject,
    "[OPTIONS]",
    ...args.map(([label]) => label)
  ].join(" ");
  if (children.length > 0) {
    usage += route2.methods.includes("execute") ? " [COMMAND]" : " <COMMAND>";
  }
  let lines = [
    heading
  ];
  if (route2.description) {
    lines.push(...wrap(route2.description, width));
  }
  lines.push("", "Usage:", `  ${usage}`);
  if (args.length > 0) {
    lines.push("", "Arguments:", ...list(args));
  }
  if (children.length > 0) {
    lines.push("", "Commands:", ...list(children.map((child) => [
      child.name,
      child.description
    ])));
  }
  options.push([
    "-h, --help",
    "Print help"
  ]);
  if (route2.methods.includes("version")) {
    options.push([
      "-v, --version",
      "Print version"
    ]);
  }
  lines.push("", "Options:", ...list(options));
  return lines.join("\n");
}
function printVersion(intent) {
  let version2 = intent.definition.version;
  if (!version2) {
    throw new TypeError(`route ${JSON.stringify(intent.route)} has no version`);
  }
  return `${title(intent)} ${version2}`;
}
function printErrors(result) {
  let subject = title(result);
  switch (result.code) {
    case "method-not-allowed":
      return [
        `${subject} does not support ${result.method.toUpperCase()}`,
        "",
        "Available methods:",
        ...result.allowed.map((method) => `  ${method.toUpperCase()}`)
      ].join("\n");
    case "unprocessable-content": {
      return result.issues.map(problem).join("\n");
    }
  }
}
function params(route2) {
  return route2.phases.flatMap((phase) => Object.values(phase.params));
}
function title(intent) {
  return intent.path.length > 0 ? intent.path.join(" ") : intent.definition.name;
}
function list(rows) {
  let size = Math.max(...rows.map(([label]) => label.length));
  let available = Math.max(24, width - size - 4);
  let lines = [];
  for (let [label, description2] of rows) {
    let prefix = `  ${label.padEnd(size)}`;
    if (!description2) {
      lines.push(prefix.trimEnd());
      continue;
    }
    let [first2, ...rest] = wrap(description2, available);
    lines.push(`${prefix}  ${first2}`);
    lines.push(...rest.map((line) => `${" ".repeat(size + 4)}${line}`));
  }
  return lines;
}
function wrap(text, size) {
  let words = text.trim().split(/\s+/);
  let lines = [];
  let line = "";
  for (let word of words) {
    if (line.length === 0) {
      line = word;
    } else if (line.length + word.length + 1 <= size) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) {
    lines.push(line);
  }
  return lines;
}
function problem(issue) {
  let location = address(issue.path);
  return location ? `${location}: ${issue.message}` : message(issue.message);
}
function message(value) {
  if (value.startsWith("unexpected ")) {
    let encoded = value.slice("unexpected ".length);
    try {
      let token = JSON.parse(encoded);
      if (typeof token === "string") {
        return `unexpected: \`${token.replaceAll("`", "\\`")}\``;
      }
    } catch {
    }
  }
  return value;
}
function address(path) {
  if (!path || path.length === 0) {
    return;
  }
  let result = "";
  for (let segment of path) {
    let key = typeof segment === "object" && segment !== null ? segment.key : segment;
    if (typeof key === "number") {
      result += `[${key}]`;
    } else if (typeof key === "symbol") {
      result += `[${String(key)}]`;
    } else if (/^[A-Za-z_$][\w$]*$/.test(key)) {
      result += result ? `.${key}` : key;
    } else {
      result += `[${JSON.stringify(key)}]`;
    }
  }
  return result;
}
var width = 80;

// lib/route.ts
function route(start, ...elements) {
  let zero = {
    ...start,
    methods: [
      "help"
    ],
    phases: [
      {
        params: {},
        routes: [],
        values: [],
        envs: []
      }
    ]
  };
  return elements.reduce((value, element) => element(value), zero);
}
function version(semver) {
  return brand((route2) => ({
    ...route2,
    methods: [
      ...route2.methods,
      "version"
    ],
    version: semver
  }));
}
function executable() {
  return brand((route2) => ({
    ...route2,
    methods: [
      ...route2.methods,
      "execute"
    ]
  }));
}
function routes(...children) {
  return brand((route2) => {
    let phases = [
      ...route2.phases
    ];
    let phase = phases.pop();
    phases.push({
      ...phase,
      routes: [
        ...phase.routes,
        ...children
      ]
    });
    return {
      ...route2,
      phases
    };
  });
}

// lib/toggle.ts
function toggle(named, ...elements) {
  const added = elements.reduce((value, element) => element(value), {
    ...param(named, binding(named.name), schema(bool)),
    decode: boolean
  });
  return brand((route2) => {
    let phases = [
      ...route2.phases
    ];
    let phase = phases.pop();
    phases.push({
      ...phase,
      params: {
        ...phase.params,
        [added.name]: added
      }
    });
    return {
      ...route2,
      phases
    };
  });
}
function binding(name2) {
  const stem = dash(name2);
  const yes = `--${stem}`;
  const no = `--no-${stem}`;
  return (param2) => ({
    ...param2,
    cli: {
      read: reader(name2),
      syntax: {
        type: "option",
        label: `${yes}, ${no}`
      }
    }
  });
}
function reader(name2) {
  const stem = dash(name2);
  const yes = `--${stem}`;
  const no = `--no-${stem}`;
  return (tokens) => {
    let claim = tokens.claimOne((token) => {
      return token.type === "flag" && (token.text === yes || token.text === no);
    });
    let [flag] = claim.tokens;
    return flag ? {
      claim,
      result: {
        ok: true,
        value: {
          exists: true,
          value: flag.text === yes
        },
        issues: []
      }
    } : {
      claim,
      result: {
        ok: true,
        value: {
          exists: false
        },
        issues: []
      }
    };
  };
}
function dash(name2) {
  return name2.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2").replace(/([a-z\d])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
}
var bool = {
  "~standard": {
    version: 1,
    vendor: "configliere",
    validate(value) {
      return typeof value === "undefined" ? {
        value: false
      } : typeof value === "boolean" ? {
        value
      } : {
        issues: [
          {
            message: "expected boolean"
          }
        ]
      };
    }
  }
};
export {
  argument,
  checkpoint,
  cli,
  command,
  description,
  env,
  executable,
  extend,
  mark,
  name,
  option,
  param,
  parse,
  printErrors,
  printHelp,
  printVersion,
  route,
  routes,
  schema,
  toggle,
  version,
  withEnvs,
  withValues
};
