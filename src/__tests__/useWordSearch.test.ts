import { renderHook, act } from '@testing-library/react-hooks';
import NetInfo from '@react-native-community/netinfo';
import { useWordSearch } from '../hooks/useWordSearch';
import { searchWords } from '../services/supabase/words';
import type { WordEntry } from '../types/dictionary';

jest.mock('../services/supabase/words', () => ({
  searchWords: jest.fn(),
}));

const mockSearchWords = searchWords as jest.MockedFunction<typeof searchWords>;
const mockNetInfo = NetInfo.fetch as jest.MockedFunction<typeof NetInfo.fetch>;

const mockResults: WordEntry[] = [
  {
    id: 'word-001',
    teochew_char: '水',
    teochew_pengim: 'zui2',
    thai_meaning: 'น้ำ',
    english_meaning: 'water',
    verified: true,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockNetInfo.mockResolvedValue({ isConnected: true } as any);
});

describe('useWordSearch', () => {
  it('starts in idle state with empty results', () => {
    const { result } = renderHook(() => useWordSearch(''));
    expect(result.current.status).toBe('idle');
    expect(result.current.results).toEqual([]);
    expect(result.current.errorMsg).toBeNull();
    expect(result.current.isOffline).toBe(false);
  });

  it('stays idle for queries shorter than 2 characters', async () => {
    const { result } = renderHook(() => useWordSearch('น'));
    await act(async () => {});
    expect(result.current.status).toBe('idle');
    expect(mockSearchWords).not.toHaveBeenCalled();
  });

  it('sets status to success and returns results on valid query', async () => {
    mockSearchWords.mockResolvedValueOnce(mockResults);

    const { result } = renderHook(() => useWordSearch('น้ำ'));
    await act(async () => {});

    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual(mockResults);
  });

  it('sets status to empty when no results found', async () => {
    mockSearchWords.mockResolvedValueOnce([]);

    const { result } = renderHook(() => useWordSearch('zzz'));
    await act(async () => {});

    expect(result.current.status).toBe('empty');
    expect(result.current.results).toEqual([]);
  });

  it('sets status to error when offline', async () => {
    mockNetInfo.mockResolvedValueOnce({ isConnected: false } as any);

    const { result } = renderHook(() => useWordSearch('น้ำ'));
    await act(async () => {});

    expect(result.current.status).toBe('error');
    expect(result.current.isOffline).toBe(true);
    expect(mockSearchWords).not.toHaveBeenCalled();
  });

  it('sets errorMsg when searchWords throws', async () => {
    mockSearchWords.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useWordSearch('น้ำ'));
    await act(async () => {});

    expect(result.current.status).toBe('error');
    expect(result.current.errorMsg).toBe('Network error');
  });

  it('retry triggers a new search', async () => {
    mockSearchWords.mockRejectedValueOnce(new Error('fail')).mockResolvedValueOnce(mockResults);

    const { result } = renderHook(() => useWordSearch('น้ำ'));
    await act(async () => {});
    expect(result.current.status).toBe('error');

    await act(async () => {
      result.current.retry();
    });
    await act(async () => {});

    expect(result.current.status).toBe('success');
    expect(result.current.results).toEqual(mockResults);
  });

  it('resets to idle when query is cleared', async () => {
    mockSearchWords.mockResolvedValueOnce(mockResults);

    const { result, rerender } = renderHook(({ q }) => useWordSearch(q), {
      initialProps: { q: 'น้ำ' },
    });
    await act(async () => {});
    expect(result.current.status).toBe('success');

    rerender({ q: '' });
    await act(async () => {});
    expect(result.current.status).toBe('idle');
    expect(result.current.results).toEqual([]);
  });
});
