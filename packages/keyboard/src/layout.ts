import type { KeyCode, KeyboardLayout } from '@interactors/globals';

export function createKeyboardLayout(map: Iterable<[KeyCode, string]>): KeyboardLayout {
  let keyMap = new Map(map);
  let codeMap = new Map(Array.from(map).map(([key, value]) => [value, key]));

  return {
    getKey(code: KeyCode): string | undefined {
      return keyMap.get(code);
    },

    getCode(key: string): KeyCode | undefined {
      return codeMap.get(key);
    },
  }
}

export const US_INTERNATIONAL: KeyboardLayout = createKeyboardLayout([
  ["Backspace", "Backspace"],
  ["Tab", "Tab"],
  ["Enter", "Enter"],
  ["ShiftLeft", "Shift"],
  ["ShiftRight", "Shift"],
  ["ControlLeft", "Control"],
  ["ControlRight", "Control"],
  ["AltLeft", "Alt"],
  ["AltRight", "Alt"],
  ["Pause", "Pause"],
  ["CapsLock", "CapsLock"],
  ["Escape", "Escape"],
  ["Space", " "],
  ["PageUp", "PageUp"],
  ["PageDown", "PageDown"],
  ["End", "End"],
  ["Home", "Home"],
  ["ArrowLeft", "ArrowLeft"],
  ["ArrowUp", "ArrowUp"],
  ["ArrowRight", "ArrowRight"],
  ["ArrowDown", "ArrowDown"],
  ["PrintScreen", "PrintScreen"],
  ["Insert", "Insert"],
  ["Delete", "Delete"],
  ["Digit0", "0"],
  ["Digit1", "1"],
  ["Digit2", "2"],
  ["Digit3", "3"],
  ["Digit4", "4"],
  ["Digit5", "5"],
  ["Digit6", "6"],
  ["Digit7", "7"],
  ["Digit8", "8"],
  ["Digit9", "9"],
  ["KeyA", "a"],
  ["KeyB", "b"],
  ["KeyC", "c"],
  ["KeyD", "d"],
  ["KeyE", "e"],
  ["KeyF", "f"],
  ["KeyG", "g"],
  ["KeyH", "h"],
  ["KeyI", "i"],
  ["KeyJ", "j"],
  ["KeyK", "k"],
  ["KeyL", "l"],
  ["KeyM", "m"],
  ["KeyN", "n"],
  ["KeyO", "o"],
  ["KeyP", "p"],
  ["KeyQ", "q"],
  ["KeyR", "r"],
  ["KeyS", "s"],
  ["KeyT", "t"],
  ["KeyU", "u"],
  ["KeyV", "v"],
  ["KeyW", "w"],
  ["KeyX", "x"],
  ["KeyY", "y"],
  ["KeyZ", "z"],
  ["MetaLeft", "Meta"],
  ["MetaRight", "Meta"],
  ["ContextMenu", "ContextMenu"],
  ["Numpad0", "0"],
  ["Numpad1", "1"],
  ["Numpad2", "2"],
  ["Numpad3", "3"],
  ["Numpad4", "4"],
  ["Numpad5", "5"],
  ["Numpad6", "6"],
  ["Numpad7", "7"],
  ["Numpad8", "8"],
  ["Numpad9", "9"],
  ["NumpadMultiply", "*"],
  ["NumpadAdd", "+"],
  ["NumpadSubtract", "-"],
  ["NumpadDecimal", "."],
  ["NumpadDivide", "/"],
  ["F1", "F1"],
  ["F2", "F2"],
  ["F3", "F3"],
  ["F4", "F4"],
  ["F5", "F5"],
  ["F6", "F6"],
  ["F7", "F7"],
  ["F8", "F8"],
  ["F9", "F9"],
  ["F10", "F10"],
  ["F11", "F11"],
  ["F12", "F12"],
  ["NumLock", "NumLock"],
  ["ScrollLock", "ScrollLock"],
  ["Semicolon", ";"],
  ["Equal", "="],
  ["Comma", ","],
  ["Minus", "-"],
  ["Period", "."],
  ["Slash", "/"],
  ["Backquote", "`"],
  ["BracketLeft", "["],
  ["Backslack", "\\"],
  ["BracketRight", "]"],
  ["Quote", "'"],
]);
