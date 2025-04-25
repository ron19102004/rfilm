import { useEffect, useState } from 'react';

const PullToRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let startY = 0;
    let startTime = 0;
    let isPulled = false;

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        startTime = Date.now();
        isPulled = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      const duration = Date.now() - startTime;
      const velocity = distance / duration; // px per ms

      if (
        distance > 100 && // kéo đủ dài
        velocity > 0.3 && // kéo đủ nhanh
        window.scrollY === 0 &&
        !isRefreshing
      ) {
        isPulled = true;
      }
    };

    const onTouchEnd = () => {
      if (isPulled) {
        setIsRefreshing(true);
        window.location.reload();
      }
    };

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isRefreshing]);

  return null;
};

export default PullToRefresh;
