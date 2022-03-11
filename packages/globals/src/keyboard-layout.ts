// NOTE: List of keys from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
export type KeyValue =
  // Special keys
  | 'Unidentified'
  // Modifier keys
  | 'Alt'
  | 'AltGraph'
  | 'CapsLock'
  | 'Control'
  | 'Fn'
  | 'FnLock'
  | 'Hyper'
  | 'Meta'
  | 'NumLock'
  | 'ScrollLock'
  | 'Shift'
  | 'Super'
  | 'Symbol'
  | 'SymbolLock'
  // Whitespace keys
  | 'Enter'
  | 'Tab'
  | ' '
  // Navigation keys
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'End'
  | 'Home'
  | 'PageDown'
  | 'PageUp'
  // Editing keys
  | 'Backspace'
  | 'Clear'
  | 'Copy'
  | 'CrSel'
  | 'Cut'
  | 'Delete'
  | 'EraseEof'
  | 'ExSel'
  | 'Insert'
  | 'Paste'
  | 'Redo'
  | 'Undo'
  // UI keys
  | 'Accept'
  | 'Again'
  | 'Attn'
  | 'Cancel'
  | 'ContextMenu'
  | 'Escape'
  | 'Execute'
  | 'Find'
  | 'Finish'
  | 'Help'
  | 'Pause'
  | 'Play'
  | 'Props'
  | 'Select'
  | 'ZoomIn'
  | 'ZoomOut'
  // Device keys
  | 'BrightnessDown'
  | 'BrightnessUp'
  | 'Eject'
  | 'LogOff'
  | 'Power'
  | 'PowerOff'
  | 'PrintScreen'
  | 'Hibernate'
  | 'Standby'
  | 'WakeUp'
  // Common IME keys
  | 'AllCandidates'
  | 'Alphanumeric'
  | 'CodeInput'
  | 'Compose'
  | 'Convert'
  | 'Dead'
  | 'FinalMode'
  | 'GroupFirst'
  | 'GroupLast'
  | 'GroupNext'
  | 'GroupPrevious'
  | 'ModeChange'
  | 'NextCandidate'
  | 'NonConvert'
  | 'PreviousCandidate'
  | 'Process'
  | 'SingleCandidate'
  // Korean keyboards only
  | 'HangulMode'
  | 'HanjaMode'
  | 'JunjaMode'
  // Japanese keyboards only
  | 'Eisu'
  | 'Hankaku'
  | 'Hiragana'
  | 'HiraganaKatakana'
  | 'KanaMode'
  | 'KanjiMode'
  | 'Katakana'
  | 'Romaji'
  | 'Zenkaku'
  | 'ZenkakuHanaku'
  // Function keys
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | 'F13'
  | 'F14'
  | 'F15'
  | 'F16'
  | 'F17'
  | 'F18'
  | 'F19'
  | 'F20'
  | 'Soft1'
  | 'Soft2'
  | 'Soft3'
  | 'Soft4'
  // Phone keys
  | 'AppSwitch'
  | 'Call'
  | 'Camera'
  | 'CameraFocus'
  | 'EndCall'
  | 'GoBack'
  | 'GoHome'
  | 'HeadsetHook'
  | 'LastNumberRedial'
  | 'Notification'
  | 'MannerMode'
  | 'VoiceDial'
  // Multimedia keys
  | 'ChannelDown'
  | 'ChannelUp'
  | 'MediaFastForward'
  | 'MediaPause'
  | 'MediaPlay'
  | 'MediaPlayPause'
  | 'MediaRecord'
  | 'MediaRewind'
  | 'MediaStop'
  | 'MediaTrackNext'
  | 'MediaTrackPrevious'
  // Audio control keys
  | 'AudioBalanceLeft'
  | 'AudioBalanceRight'
  | 'AudioBassDown'
  | 'AudioBassBoostDown'
  | 'AudioBassBoostToggle'
  | 'AudioBassBoostUp'
  | 'AudioBassUp'
  | 'AudioFaderFront'
  | 'AudioFaderRear'
  | 'AudioSurroundModeNext'
  | 'AudioTrebleDown'
  | 'AudioTrebleUp'
  | 'AudioVolumeDown'
  | 'AudioVolumeMute'
  | 'AudioVolumeUp'
  | 'MicrophoneToggle'
  | 'MicrophoneVolumeDown'
  | 'MicrophoneVolumeMute'
  | 'MicrophoneVolumeUp'
  // TV control keys
  | 'TV'
  | 'TV3DMode'
  | 'TVAntennaCable'
  | 'TVAudioDescription'
  | 'TVAudioDescriptionMixDown'
  | 'TVAudioDescriptionMixUp'
  | 'TVContentsMenu'
  | 'TVDataService'
  | 'TVInput'
  | 'TVInputComponent1'
  | 'TVInputComponent2'
  | 'TVInputComposite1'
  | 'TVInputComposite2'
  | 'TVInputHDMI1'
  | 'TVInputHDMI2'
  | 'TVInputHDMI3'
  | 'TVInputHDMI4'
  | 'TVInputVGA1'
  | 'TVMediaContext'
  | 'TVNetwork'
  | 'TVNumberEntry'
  | 'TVPower'
  | 'TVRadioService'
  | 'TVSatellite'
  | 'TVSatelliteBS'
  | 'TVSatelliteCS'
  | 'TVSatelliteToggle'
  | 'TVTerrestrialAnalog'
  | 'TVTerrestrialDigital'
  | 'TVTimer'
  // Media controller keys
  | 'AVRInput'
  | 'AVRPower'
  | 'ColorF0Red'
  | 'ColorF1Green'
  | 'ColorF2Yellow'
  | 'ColorF3Blue'
  | 'ColorF4Grey'
  | 'ColorF5Brown'
  | 'ClosedCaptionToggle'
  | 'Dimmer'
  | 'DisplaySwap'
  | 'DVR'
  | 'Exit'
  | 'FavoriteClear0'
  | 'FavoriteClear1'
  | 'FavoriteClear2'
  | 'FavoriteClear3'
  | 'FavoriteRecall0'
  | 'FavoriteRecall1'
  | 'FavoriteRecall2'
  | 'FavoriteRecall3'
  | 'FavoriteStore0'
  | 'FavoriteStore1'
  | 'FavoriteStore2'
  | 'FavoriteStore3'
  | 'Guide'
  | 'GuideNextDay'
  | 'GuidePreviousDay'
  | 'Info'
  | 'InstantReplay'
  | 'Link'
  | 'ListProgram'
  | 'LiveContent'
  | 'Lock'
  | 'MediaApps'
  | 'MediaAudioTrack'
  | 'MediaLast'
  | 'MediaSkipBackward'
  | 'MediaSkipForward'
  | 'MediaStepBackward'
  | 'MediaStepForward'
  | 'MediaTopMenu'
  | 'NavigateIn'
  | 'NavigateNext'
  | 'NavigateOut'
  | 'NavigatePrevious'
  | 'NextFavoriteChannel'
  | 'NextUserProfile'
  | 'OnDemand'
  | 'Pairing'
  | 'PinPDown'
  | 'PinPMove'
  | 'PinPToggle'
  | 'PinPUp'
  | 'PlaySpeedDown'
  | 'PlaySpeedReset'
  | 'PlaySpeedUp'
  | 'RandomToggle'
  | 'RcLowBattery'
  | 'RecordSpeedNext'
  | 'RfBypass'
  | 'ScanChannelsToggle'
  | 'ScreenModeNext'
  | 'Settings'
  | 'SplitScreenToggle'
  | 'STBInput'
  | 'STBPower'
  | 'Subtitle'
  | 'Teletext'
  | 'VideoModeNext'
  | 'Wink'
  | 'ZoomToggle'
  // Speech recognition keys
  | 'SpeechCorrectionList'
  | 'SpeechInputToggle'
  // Document keys
  | 'Close'
  | 'New'
  | 'Open'
  | 'Print'
  | 'Save'
  | 'SpellCheck'
  | 'MailForward'
  | 'MailReply'
  | 'MailSend'
  // Application selector keys
  | 'LaunchCalculator'
  | 'LaunchCalendar'
  | 'LaunchContacts'
  | 'LaunchMail'
  | 'LaunchMediaPlayer'
  | 'LaunchMusicPlayer'
  | 'LaunchMyComputer'
  | 'LaunchPhone'
  | 'LaunchScreenSaver'
  | 'LaunchSpreadsheet'
  | 'LaunchWebBrowser'
  | 'LaunchWebCam'
  | 'LaunchWordProcessor'
  | 'LaunchApplication1'
  | 'LaunchApplication2'
  | 'LaunchApplication3'
  | 'LaunchApplication4'
  | 'LaunchApplication5'
  | 'LaunchApplication6'
  | 'LaunchApplication7'
  | 'LaunchApplication8'
  | 'LaunchApplication9'
  | 'LaunchApplication10'
  | 'LaunchApplication11'
  | 'LaunchApplication12'
  | 'LaunchApplication13'
  | 'LaunchApplication14'
  | 'LaunchApplication15'
  | 'LaunchApplication16'
  // Browser control keys
  | 'BrowserBack'
  | 'BrowserFavorites'
  | 'BrowserForward'
  | 'BrowserHome'
  | 'BrowserRefresh'
  | 'BrowserSearch'
  | 'BrowserStop'
  // Numeric keypad keys
  | 'Decimal'
  | 'Key11'
  | 'Key12'
  | 'Multiply'
  | 'Add'
  | 'Clear'
  | 'Divide'
  | 'Subtract'
  | 'Separator'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'

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

export const NonPrintableKeys: Set<KeyValue> = new Set([
  // Special keys,
  'Unidentified',
  // Modifier keys
  'Alt',
  'AltGraph',
  'CapsLock',
  'Control',
  'Fn',
  'FnLock',
  'Hyper',
  'Meta',
  'NumLock',
  'ScrollLock',
  'Shift',
  'Super',
  'Symbol',
  'SymbolLock',
  // Whitespace keys
  'Enter',
  'Tab',
  // Navigation keys
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  // Editing keys
  'Backspace',
  'Clear',
  'Copy',
  'CrSel',
  'Cut',
  'Delete',
  'EraseEof',
  'ExSel',
  'Insert',
  'Paste',
  'Redo',
  'Undo',
  // UI keys
  'Accept',
  'Again',
  'Attn',
  'Cancel',
  'ContextMenu',
  'Escape',
  'Execute',
  'Find',
  'Finish',
  'Help',
  'Pause',
  'Play',
  'Props',
  'Select',
  'ZoomIn',
  'ZoomOut',
  // Device keys
  'BrightnessDown',
  'BrightnessUp',
  'Eject',
  'LogOff',
  'Power',
  'PowerOff',
  'PrintScreen',
  'Hibernate',
  'Standby',
  'WakeUp',
  // Common IME keys
  'AllCandidates',
  'Alphanumeric',
  'CodeInput',
  'Compose',
  'Convert',
  'Dead',
  'FinalMode',
  'GroupFirst',
  'GroupLast',
  'GroupNext',
  'GroupPrevious',
  'ModeChange',
  'NextCandidate',
  'NonConvert',
  'PreviousCandidate',
  'Process',
  'SingleCandidate',
  // Korean keyboards only
  'HangulMode',
  'HanjaMode',
  'JunjaMode',
  // Japanese keyboards only
  'Eisu',
  'Hankaku',
  'Hiragana',
  'HiraganaKatakana',
  'KanaMode',
  'KanjiMode',
  'Katakana',
  'Romaji',
  'Zenkaku',
  'ZenkakuHanaku',
  // Function keys
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'F13',
  'F14',
  'F15',
  'F16',
  'F17',
  'F18',
  'F19',
  'F20',
  'Soft1',
  'Soft2',
  'Soft3',
  'Soft4',
  // Phone keys
  'AppSwitch',
  'Call',
  'Camera',
  'CameraFocus',
  'EndCall',
  'GoBack',
  'GoHome',
  'HeadsetHook',
  'LastNumberRedial',
  'Notification',
  'MannerMode',
  'VoiceDial',
  // Multimedia keys
  'ChannelDown',
  'ChannelUp',
  'MediaFastForward',
  'MediaPause',
  'MediaPlay',
  'MediaPlayPause',
  'MediaRecord',
  'MediaRewind',
  'MediaStop',
  'MediaTrackNext',
  'MediaTrackPrevious',
  // Audio control keys
  'AudioBalanceLeft',
  'AudioBalanceRight',
  'AudioBassDown',
  'AudioBassBoostDown',
  'AudioBassBoostToggle',
  'AudioBassBoostUp',
  'AudioBassUp',
  'AudioFaderFront',
  'AudioFaderRear',
  'AudioSurroundModeNext',
  'AudioTrebleDown',
  'AudioTrebleUp',
  'AudioVolumeDown',
  'AudioVolumeMute',
  'AudioVolumeUp',
  'MicrophoneToggle',
  'MicrophoneVolumeDown',
  'MicrophoneVolumeMute',
  'MicrophoneVolumeUp',
  // TV control keys
  'TV',
  'TV3DMode',
  'TVAntennaCable',
  'TVAudioDescription',
  'TVAudioDescriptionMixDown',
  'TVAudioDescriptionMixUp',
  'TVContentsMenu',
  'TVDataService',
  'TVInput',
  'TVInputComponent1',
  'TVInputComponent2',
  'TVInputComposite1',
  'TVInputComposite2',
  'TVInputHDMI1',
  'TVInputHDMI2',
  'TVInputHDMI3',
  'TVInputHDMI4',
  'TVInputVGA1',
  'TVMediaContext',
  'TVNetwork',
  'TVNumberEntry',
  'TVPower',
  'TVRadioService',
  'TVSatellite',
  'TVSatelliteBS',
  'TVSatelliteCS',
  'TVSatelliteToggle',
  'TVTerrestrialAnalog',
  'TVTerrestrialDigital',
  'TVTimer',
  // Media controller keys
  'AVRInput',
  'AVRPower',
  'ColorF0Red',
  'ColorF1Green',
  'ColorF2Yellow',
  'ColorF3Blue',
  'ColorF4Grey',
  'ColorF5Brown',
  'ClosedCaptionToggle',
  'Dimmer',
  'DisplaySwap',
  'DVR',
  'Exit',
  'FavoriteClear0',
  'FavoriteClear1',
  'FavoriteClear2',
  'FavoriteClear3',
  'FavoriteRecall0',
  'FavoriteRecall1',
  'FavoriteRecall2',
  'FavoriteRecall3',
  'FavoriteStore0',
  'FavoriteStore1',
  'FavoriteStore2',
  'FavoriteStore3',
  'Guide',
  'GuideNextDay',
  'GuidePreviousDay',
  'Info',
  'InstantReplay',
  'Link',
  'ListProgram',
  'LiveContent',
  'Lock',
  'MediaApps',
  'MediaAudioTrack',
  'MediaLast',
  'MediaSkipBackward',
  'MediaSkipForward',
  'MediaStepBackward',
  'MediaStepForward',
  'MediaTopMenu',
  'NavigateIn',
  'NavigateNext',
  'NavigateOut',
  'NavigatePrevious',
  'NextFavoriteChannel',
  'NextUserProfile',
  'OnDemand',
  'Pairing',
  'PinPDown',
  'PinPMove',
  'PinPToggle',
  'PinPUp',
  'PlaySpeedDown',
  'PlaySpeedReset',
  'PlaySpeedUp',
  'RandomToggle',
  'RcLowBattery',
  'RecordSpeedNext',
  'RfBypass',
  'ScanChannelsToggle',
  'ScreenModeNext',
  'Settings',
  'SplitScreenToggle',
  'STBInput',
  'STBPower',
  'Subtitle',
  'Teletext',
  'VideoModeNext',
  'Wink',
  'ZoomToggle',
  // Speech recognition keys
  'SpeechCorrectionList',
  'SpeechInputToggle',
  // Document keys
  'Close',
  'New',
  'Open',
  'Print',
  'Save',
  'SpellCheck',
  'MailForward',
  'MailReply',
  'MailSend',
  // Application selector keys
  'LaunchCalculator',
  'LaunchCalendar',
  'LaunchContacts',
  'LaunchMail',
  'LaunchMediaPlayer',
  'LaunchMusicPlayer',
  'LaunchMyComputer',
  'LaunchPhone',
  'LaunchScreenSaver',
  'LaunchSpreadsheet',
  'LaunchWebBrowser',
  'LaunchWebCam',
  'LaunchWordProcessor',
  'LaunchApplication1',
  'LaunchApplication2',
  'LaunchApplication3',
  'LaunchApplication4',
  'LaunchApplication5',
  'LaunchApplication6',
  'LaunchApplication7',
  'LaunchApplication8',
  'LaunchApplication9',
  'LaunchApplication10',
  'LaunchApplication11',
  'LaunchApplication12',
  'LaunchApplication13',
  'LaunchApplication14',
  'LaunchApplication15',
  'LaunchApplication16',
  // Browser control keys
  'BrowserBack',
  'BrowserFavorites',
  'BrowserForward',
  'BrowserHome',
  'BrowserRefresh',
  'BrowserSearch',
  'BrowserStop',
  // Numeric keypad keys
  'Decimal',
  'Key11',
  'Key12',
  'Multiply',
  'Add',
  'Clear',
  'Divide',
  'Subtract',
  'Separator'
]);

interface CommonKey {
  code: KeyCode;
  key: string;
  shiftKey?: true;
}

interface SpecialKey {
  code: KeyCode;
  key: KeyValue;
  shiftKey?: true;
}

export type Key = CommonKey | SpecialKey

export interface KeyboardLayout {
  getByCode(code: KeyCode): Key | undefined;
  getByKey(key: string): Key | undefined;
}
