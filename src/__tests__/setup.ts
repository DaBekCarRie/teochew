// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

// Mock expo-audio (native module — not available in Jest)
jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(() => Promise.resolve()),
    setPlaybackRate: jest.fn(),
    remove: jest.fn(),
    addListener: jest.fn(),
    shouldCorrectPitch: false,
    volume: 1,
  })),
  setAudioModeAsync: jest.fn(() => Promise.resolve()),
}));

// Mock Supabase client
jest.mock('../services/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));
