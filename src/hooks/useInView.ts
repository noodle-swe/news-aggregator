import { useEffect, useRef, useState } from 'react';

/** Reports when an element scrolls near the viewport (used for infinite loading). */
export function useInView<T extends Element>(rootMargin = '600px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting), {
      rootMargin,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
