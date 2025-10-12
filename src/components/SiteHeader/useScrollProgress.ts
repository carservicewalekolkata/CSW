import { useEffect, useState } from 'react';

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let rafId = 0;

    const updateProgress = () => {
      const doc = document.documentElement;
      const maxScrollable = doc.scrollHeight - window.innerHeight;
      const nextProgress = maxScrollable > 0 ? window.scrollY / maxScrollable : 0;
      setProgress(clamp(nextProgress));
      rafId = 0;
    };

    const requestTick = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    updateProgress();

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return progress;
};
