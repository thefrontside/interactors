import { Key, KeyCode, KeyboardLayout } from "@interactors/globals";

export const defaultKeyMap = [
  ..."0123456789".split("").map((digit) => ({ code: `Digit${digit}`, key: digit })),
  ...")!@#$%^&*(".split("").map((key, digit) => ({ code: `Digit${digit}`, key, shiftKey: true })),
  ..."abcdefghijklmnopqrstuvwxyz".split("").map((key) => ({ code: `Key${key.toUpperCase()}`, key })),
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((key) => ({ code: `Key${key}`, key, shiftKey: true })),
  ...Array.from({ length: 12 })
    .map((_, digit) => `F${digit + 1}`)
    .map((key) => ({ code: key, key })),
  ...[
    "Backspace",
    "Tab",
    "Enter",
    "Pause",
    "CapsLock",
    "Escape",
    "PageUp",
    "PageDown",
    "End",
    "Home",
    "ArrowLeft",
    "ArrowUp",
    "ArrowRight",
    "ArrowDown",
    "PrintScreen",
    "Insert",
    "Delete",
    "ContextMenu",
    "NumLock",
    "ScrollLock",
  ].map((code) => ({ code, key: code })),

  { code: "Space", key: " " },
  { code: "AltLeft", key: "Alt" },
  { code: "AltRight", key: "Alt" },
  { code: "ShiftLeft", key: "Shift" },
  { code: "ShiftRight", key: "Shift" },
  { code: "ControlLeft", key: "Control" },
  { code: "ControlRight", key: "Control" },
  { code: "MetaLeft", key: "Meta" },
  { code: "MetaRight", key: "Meta" },

  { code: "Semicolon", key: ";" },
  { code: "Equal", key: "=" },
  { code: "Comma", key: "," },
  { code: "Minus", key: "-" },
  { code: "Period", key: "." },
  { code: "Slash", key: "/" },
  { code: "Backquote", key: "`" },
  { code: "BracketLeft", key: "[" },
  { code: "Backslash", key: "\\" },
  { code: "BracketRight", key: "]" },
  { code: "Quote", key: "'" },

  { code: "Semicolon", key: ":", shiftKey: true },
  { code: "Equal", key: "+", shiftKey: true },
  { code: "Comma", key: "<", shiftKey: true },
  { code: "Minus", key: "_", shiftKey: true },
  { code: "Period", key: ">", shiftKey: true },
  { code: "Slash", key: "?", shiftKey: true },
  { code: "Backquote", key: "~", shiftKey: true },
  { code: "BracketLeft", key: "{", shiftKey: true },
  { code: "Backslash", key: "|", shiftKey: true },
  { code: "BracketRight", key: "}", shiftKey: true },
  { code: "Quote", key: '"', shiftKey: true },

  ..."0123456789".split("").map((digit) => ({ code: `Numpad${digit}`, key: digit })),
  { code: "NumpadMultiply", key: "*" },
  { code: "NumpadAdd", key: "+" },
  { code: "NumpadSubtract", key: "-" },
  { code: "NumpadDecimal", key: "." },
  { code: "NumpadDivide", key: "/" },
] as Key[];

export function createKeyboardLayout(override: (Key)[] = []): KeyboardLayout {
  let codeMap = new Map<KeyCode, Key[]>();
  let keyMap = new Map<string, Key[]>();

  [...override, ...defaultKeyMap].forEach((key) => {
    codeMap.get(key.code)?.push(key) ?? codeMap.set(key.code, [key]);
    keyMap.get(key.key)?.push(key) ?? keyMap.set(key.key, [key]);
  });

  return {
    getByCode(code: KeyCode): Key | undefined {
      return codeMap.get(code)?.[0];
    },

    getByKey(key: string): Key | undefined {
      return keyMap.get(key)?.[0];
    },
  };
}

export const US_INTERNATIONAL = createKeyboardLayout();
