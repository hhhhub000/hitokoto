import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Testing Libraryのカスタムマッチャーを拡張
expect.extend(matchers);

// 各テスト後にクリーンアップ
afterEach(() => {
  cleanup();
});

// グローバルなモック設定
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ResizeObserver のモック
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// IntersectionObserver のモック
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// URL.createObjectURL のモック（ファイルアップロードテスト用）
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// File API のモック
global.File = class MockFile {
  constructor(public chunks: any[], public filename: string, public options: any = {}) {}
  get name() { return this.filename; }
  get size() { return this.chunks.reduce((acc, chunk) => acc + chunk.length, 0); }
  get type() { return this.options.type || ''; }
} as any;

global.FileReader = class MockFileReader {
  result: any = null;
  error: any = null;
  readyState: number = 0;
  onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null = null;
  
  readAsDataURL(file: File) {
    this.readyState = 2;
    this.result = `data:${file.type};base64,mock-base64-data`;
    if (this.onload) {
      this.onload({} as ProgressEvent<FileReader>);
    }
  }
  
  readAsText(file: File) {
    this.readyState = 2;
    this.result = 'mock file content';
    if (this.onload) {
      this.onload({} as ProgressEvent<FileReader>);
    }
  }
} as any;

// localStorage のモック
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock;

// sessionStorage のモック
global.sessionStorage = localStorageMock;

// fetch のモック（必要に応じて）
global.fetch = vi.fn();

// console のモック（テスト中の不要なログを抑制）
global.console = {
  ...console,
  // テスト中は warn と error のみ表示
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: console.warn,
  error: console.error,
};

// テスト用のヘルパー関数
export const testUtils = {
  // APIレスポンスのモック作成
  createMockApiResponse: <T>(data: T, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  }),

  // ファイルのモック作成
  createMockFile: (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
    const content = 'x'.repeat(size);
    return new File([content], name, { type });
  },

  // 日記データのモック作成
  createMockDiary: (overrides = {}) => ({
    id: 'mock-id-' + Math.random().toString(36).substr(2, 9),
    text: 'モック日記テキスト',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }),

  // 装飾付きテキストのモック作成
  createDecoratedText: (text: string, decorations: string[] = []) => {
    let result = text;
    decorations.forEach(decoration => {
      switch (decoration) {
        case 'bold':
          result = `<b>${result}</b>`;
          break;
        case 'italic':
          result = `<i>${result}</i>`;
          break;
        case 'underline':
          result = `<u>${result}</u>`;
          break;
        case 'strikethrough':
          result = `<s>${result}</s>`;
          break;
      }
    });
    return result;
  },

  // 絵文字付きテキストのモック作成
  createTextWithEmoji: (text: string, emojis: string[] = ['😊']) => {
    return text + ' ' + emojis.join(' ');
  },

  // ASCIIアート付きテキストのモック作成  
  createTextWithAscii: (text: string, ascii = '٩(◕‿◕)۶') => {
    return text + ' ' + ascii;
  },

  // DOM要素のテキスト選択をシミュレート
  simulateTextSelection: (element: HTMLTextAreaElement, start: number, end: number) => {
    element.setSelectionRange(start, end);
    element.dispatchEvent(new Event('select', { bubbles: true }));
  },

  // キーボードイベントのシミュレート
  simulateKeyPress: (element: HTMLElement, key: string, options = {}) => {
    const event = new KeyboardEvent('keydown', { key, ...options });
    element.dispatchEvent(event);
  },

  // ドラッグ&ドロップのシミュレート
  simulateDragDrop: (dragElement: HTMLElement, dropElement: HTMLElement, files: File[] = []) => {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    
    const dragEvent = new DragEvent('dragstart', { dataTransfer });
    const dropEvent = new DragEvent('drop', { dataTransfer });
    
    dragElement.dispatchEvent(dragEvent);
    dropElement.dispatchEvent(dropEvent);
  },

  // ウィンドウリサイズのシミュレート
  simulateWindowResize: (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', { value: width });
    Object.defineProperty(window, 'innerHeight', { value: height });
    window.dispatchEvent(new Event('resize'));
  },

  // タッチイベントのシミュレート（モバイルテスト用）
  simulateTouch: (element: HTMLElement, type: 'touchstart' | 'touchend' | 'touchmove', options = {}) => {
    const touch = new Touch({
      identifier: 1,
      target: element,
      clientX: 0,
      clientY: 0,
      ...options,
    });
    
    const event = new TouchEvent(type, {
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
    });
    
    element.dispatchEvent(event);
  },
};

// カスタムマッチャーの定義
declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveTextDecoration(): T;
    toContainEmoji(): T;
    toContainAsciiArt(): T;
  }
}

// カスタムマッチャーの実装
expect.extend({
  toHaveTextDecoration(received: string) {
    const hasDecorations = /<[^>]+>.*<\/[^>]+>/.test(received);
    return {
      message: () => 
        `expected "${received}" ${hasDecorations ? 'not ' : ''}to have text decorations`,
      pass: hasDecorations,
    };
  },
  
  toContainEmoji(received: string) {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    const hasEmoji = emojiRegex.test(received);
    return {
      message: () => 
        `expected "${received}" ${hasEmoji ? 'not ' : ''}to contain emoji`,
      pass: hasEmoji,
    };
  },
  
  toContainAsciiArt(received: string) {
    const asciiPatterns = [/[٩۶]/g, /[⌐■_■]/g, /[◕‿◕]/g, /[＼(＾o＾)／]/g];
    const hasAscii = asciiPatterns.some(pattern => pattern.test(received));
    return {
      message: () => 
        `expected "${received}" ${hasAscii ? 'not ' : ''}to contain ASCII art`,
      pass: hasAscii,
    };
  },
});

export default testUtils;