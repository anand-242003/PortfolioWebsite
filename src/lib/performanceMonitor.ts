/**
 * Performance Monitoring Utilities
 * Track Core Web Vitals and custom metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

/**
 * Core Web Vitals thresholds
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

/**
 * Get rating based on value and thresholds
 */
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Log metric to console (dev mode) or analytics (production)
 */
function logMetric(metric: PerformanceMetric) {
  if (import.meta.env.DEV) {
    const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(
      `${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
    );
  }

  // In production, send to analytics
  // Example: sendToAnalytics(metric);
}

/**
 * Measure Largest Contentful Paint (LCP)
 * Target: < 2.5s
 */
export function measureLCP() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime: number;
        loadTime: number;
      };

      const value = lastEntry.renderTime || lastEntry.loadTime;
      logMetric({
        name: 'LCP',
        value,
        rating: getRating(value, THRESHOLDS.LCP),
        timestamp: Date.now(),
      });
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.error('Error measuring LCP:', error);
  }
}

/**
 * Measure First Input Delay (FID)
 * Target: < 100ms
 */
export function measureFID() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const value = entry.processingStart - entry.startTime;
        logMetric({
          name: 'FID',
          value,
          rating: getRating(value, THRESHOLDS.FID),
          timestamp: Date.now(),
        });
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.error('Error measuring FID:', error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 * Target: < 0.1
 */
export function measureCLS() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  let clsValue = 0;
  let sessionValue = 0;
  let sessionEntries: any[] = [];

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            logMetric({
              name: 'CLS',
              value: clsValue,
              rating: getRating(clsValue, THRESHOLDS.CLS),
              timestamp: Date.now(),
            });
          }
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.error('Error measuring CLS:', error);
  }
}

/**
 * Measure First Contentful Paint (FCP)
 * Target: < 1.8s
 */
export function measureFCP() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          logMetric({
            name: 'FCP',
            value: entry.startTime,
            rating: getRating(entry.startTime, THRESHOLDS.FCP),
            timestamp: Date.now(),
          });
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.error('Error measuring FCP:', error);
  }
}

/**
 * Measure Time to First Byte (TTFB)
 * Target: < 800ms
 */
export function measureTTFB() {
  if (typeof window === 'undefined' || !window.performance) return;

  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart;
      logMetric({
        name: 'TTFB',
        value,
        rating: getRating(value, THRESHOLDS.TTFB),
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error measuring TTFB:', error);
  }
}

/**
 * Measure custom metric: 3D Scene Load Time
 */
export function measure3DSceneLoad(startTime: number) {
  const loadTime = performance.now() - startTime;
  logMetric({
    name: '3D Scene Load',
    value: loadTime,
    rating: loadTime < 1000 ? 'good' : loadTime < 2000 ? 'needs-improvement' : 'poor',
    timestamp: Date.now(),
  });
}

/**
 * Measure FPS (Frames Per Second)
 * Target: 60 FPS
 */
export function measureFPS(callback: (fps: number) => void) {
  let lastTime = performance.now();
  let frames = 0;

  function tick() {
    frames++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      callback(fps);

      if (import.meta.env.DEV) {
        const emoji = fps >= 55 ? '✅' : fps >= 30 ? '⚠️' : '❌';
        console.log(`${emoji} FPS: ${fps}`);
      }

      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/**
 * Initialize all performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  measureLCP();
  measureFID();
  measureCLS();
  measureFCP();
  measureTTFB();

  // Log when page is fully loaded
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        console.log('📊 Performance Summary:');
        console.log(`  DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
        console.log(`  Load Complete: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        console.log(`  Total Load Time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
      }
    }, 0);
  });
}

/**
 * Report bundle size (dev only)
 */
export function reportBundleSize() {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let totalSize = 0;

      resources.forEach((resource) => {
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          totalSize += resource.transferSize || 0;
        }
      });

      console.log(`📦 Total Bundle Size: ${(totalSize / 1024).toFixed(2)} KB`);
    });
  }
}
