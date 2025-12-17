// Vitest setup file
import "@testing-library/jest-dom";
import "fake-indexeddb/auto";

// Mock window.matchMedia for responsive hooks
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: class MockNotification {
    static permission: NotificationPermission = 'default';
    static requestPermission = async () => 'granted' as NotificationPermission;
    constructor() {}
    close() {}
  },
});

// Mock navigator.vibrate for haptic feedback
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: () => true,
});
