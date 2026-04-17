import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../hooks/useDebounce';

jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
});

describe('useDebounce', () => {
  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'hello' },
    });

    rerender({ value: 'world' });
    jest.advanceTimersByTime(299);
    expect(result.current).toBe('hello');
  });

  it('updates value after delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'hello' },
    });

    rerender({ value: 'world' });
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('world');
  });

  it('resets timer on rapid value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    jest.advanceTimersByTime(200);
    rerender({ value: 'abc' });
    jest.advanceTimersByTime(200);
    // only 200ms since last change — should not have updated
    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });

  it('works with non-string values', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 1 },
    });

    rerender({ value: 42 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe(42);
  });
});
