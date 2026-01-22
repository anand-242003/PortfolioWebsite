/**
 * View Transitions API utilities
 * Provides smooth transitions between page states
 * Fallback to CSS transitions for unsupported browsers
 */

/**
 * Check if View Transitions API is supported
 */
export const supportsViewTransitions = (): boolean => {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
};

/**
 * Perform a view transition with fallback
 * @param callback - Function to execute during transition
 * @param transitionName - Optional transition name for CSS targeting
 */
export const viewTransition = async (
  callback: () => void | Promise<void>,
  transitionName?: string
): Promise<void> => {
  // Check for View Transitions API support
  if (!supportsViewTransitions()) {
    // Fallback: Simple opacity transition
    const root = document.documentElement;
    root.style.opacity = '0';
    root.style.transition = 'opacity 0.3s ease-in-out';

    await new Promise((resolve) => setTimeout(resolve, 150));
    await callback();
    await new Promise((resolve) => setTimeout(resolve, 50));

    root.style.opacity = '1';
    await new Promise((resolve) => setTimeout(resolve, 300));
    root.style.transition = '';

    return;
  }

  // Use View Transitions API
  const transition = (document as any).startViewTransition(async () => {
    await callback();
  });

  // Add transition name if provided
  if (transitionName && transition) {
    document.documentElement.style.setProperty('view-transition-name', transitionName);
  }

  await transition.finished;

  // Cleanup
  if (transitionName) {
    document.documentElement.style.removeProperty('view-transition-name');
  }
};

/**
 * Add view transition name to element
 * @param element - HTML element
 * @param name - Transition name
 */
export const setViewTransitionName = (element: HTMLElement, name: string): void => {
  element.style.viewTransitionName = name;
};

/**
 * Remove view transition name from element
 * @param element - HTML element
 */
export const removeViewTransitionName = (element: HTMLElement): void => {
  element.style.viewTransitionName = '';
};

/**
 * CSS for View Transitions
 * Add to global styles
 */
export const viewTransitionsCSS = `
/* View Transitions API styles */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

/* Fade transition */
::view-transition-old(fade) {
  animation: fade-out 0.3s ease-out;
}

::view-transition-new(fade) {
  animation: fade-in 0.3s ease-in;
}

/* Slide transition */
::view-transition-old(slide) {
  animation: slide-out 0.4s ease-out;
}

::view-transition-new(slide) {
  animation: slide-in 0.4s ease-in;
}

/* Scale transition */
::view-transition-old(scale) {
  animation: scale-out 0.3s ease-out;
}

::view-transition-new(scale) {
  animation: scale-in 0.3s ease-in;
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@keyframes slide-out {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes scale-out {
  to {
    transform: scale(0.8);
    opacity: 0;
  }
}

@keyframes scale-in {
  from {
    transform: scale(1.2);
    opacity: 0;
  }
}

/* Fallback for browsers without View Transitions API */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
  }
}
`;
