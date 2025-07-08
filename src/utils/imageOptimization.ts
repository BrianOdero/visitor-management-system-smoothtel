// Image optimization utilities
export const optimizeImageUrl = (url: string, width?: number, height?: number, quality = 80) => {
  // For external images like Pexels, add optimization parameters
  if (url.includes('pexels.com')) {
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('auto', 'compress');
    params.set('cs', 'tinysrgb');
    
    return `${url}?${params.toString()}`;
  }
  
  return url;
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Lazy loading utility
export const createIntersectionObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });
};