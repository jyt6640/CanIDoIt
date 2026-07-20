'use client';

import { useEffect } from 'react';

/** locked === true 인 동안 body 스크롤을 잠근다 */
export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (locked) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [locked]);
};
