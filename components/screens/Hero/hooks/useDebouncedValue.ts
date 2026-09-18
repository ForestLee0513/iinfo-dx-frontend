import { useEffect, useState } from "react";

// 자동완성 API는 입력이 멈춘 뒤에만 호출해, 빠른 타이핑 중 불필요한 요청을 줄인다.
export function useDebouncedValue(value: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}
