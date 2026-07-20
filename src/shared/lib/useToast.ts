'use client';

import { useCallback, useRef, useState } from 'react';

export interface ToastState {
  message: string;
  visible: boolean;
}

/** 일정 시간 뒤 자동으로 사라지는 토스트 상태 관리 */
export const useToast = (duration = 3000) => {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ message, visible: true });
      timerRef.current = setTimeout(() => {
        setToast({ message: '', visible: false });
      }, duration);
    },
    [duration],
  );

  return { toast, showToast };
};
