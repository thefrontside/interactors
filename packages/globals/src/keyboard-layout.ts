export type KeyCode =
  | "Backspace"
  | "Tab"
  | "Enter"
  | "ShiftLeft"
  | "ShiftRight"
  | "ControlLeft"
  | "ControlRight"
  | "AltLeft"
  | "AltRight"
  | "Pause"
  | "CapsLock"
  | "Escape"
  | "Space"
  | "PageUp"
  | "PageDown"
  | "End"
  | "Home"
  | "ArrowLeft"
  | "ArrowUp"
  | "ArrowRight"
  | "ArrowDown"
  | "PrintScreen"
  | "Insert"
  | "Delete"
  | "Digit0"
  | "Digit1"
  | "Digit2"
  | "Digit3"
  | "Digit4"
  | "Digit5"
  | "Digit6"
  | "Digit7"
  | "Digit8"
  | "Digit9"
  | "KeyA"
  | "KeyB"
  | "KeyC"
  | "KeyD"
  | "KeyE"
  | "KeyF"
  | "KeyG"
  | "KeyH"
  | "KeyI"
  | "KeyJ"
  | "KeyK"
  | "KeyL"
  | "KeyM"
  | "KeyN"
  | "KeyO"
  | "KeyP"
  | "KeyQ"
  | "KeyR"
  | "KeyS"
  | "KeyT"
  | "KeyU"
  | "KeyV"
  | "KeyW"
  | "KeyX"
  | "KeyY"
  | "KeyZ"
  | "MetaLeft"
  | "MetaRight"
  | "ContextMenu"
  | "Numpad0"
  | "Numpad1"
  | "Numpad2"
  | "Numpad3"
  | "Numpad4"
  | "Numpad5"
  | "Numpad6"
  | "Numpad7"
  | "Numpad8"
  | "Numpad9"
  | "NumpadMultiply"
  | "NumpadAdd"
  | "NumpadSubtract"
  | "NumpadDecimal"
  | "NumpadDivide"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "NumLock"
  | "ScrollLock"
  | "Semicolon"
  | "Equal"
  | "Comma"
  | "Minus"
  | "Period"
  | "Slash"
  | "Backquote"
  | "BracketLeft"
  | "Backslash"
  | "BracketRight"
  | "Quote";

export const FunctionalKeys: KeyCode[] = [
  "Backspace",
  "Tab",
  "Enter",
  "ShiftLeft",
  "ShiftRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
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
  "MetaLeft",
  "MetaRight",
  "ContextMenu",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "NumLock",
  "ScrollLock",
];

export interface Key {
  code: KeyCode;
  key: string;
  shiftKey?: true;
}

export interface KeyboardLayout {
  getByCode(code: KeyCode): Key | undefined;
  getByKey(key: string): Key | undefined;
}
