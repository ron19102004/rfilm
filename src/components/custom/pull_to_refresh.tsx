import { useEffect, useState } from 'react';

const PullToRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let startY = 0;
    let isPulled = false;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const distance = e.touches[0].clientY - startY;
      if (distance > 80 && window.scrollY === 0 && !isRefreshing) {
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
