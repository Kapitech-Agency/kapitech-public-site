import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const MOTION_SELECTOR = [
  '.kapi-public-shell main section',
  '.kapi-public-shell main form',
  '.kapi-public-shell main [role="dialog"]',
  '.kapi-public-shell main .kapi-card',
  '.kapi-public-shell main [class*="rounded-2xl"][class*="bg-[#16181D]"][class*="border"]',
  '.kapi-public-shell main [class*="rounded-3xl"][class*="bg-[#16181D]"][class*="border"]',
  '.kapi-public-shell > nav',
  '.kapi-public-shell > footer',
  '.kapi-public-shell .fixed.inset-0',
].join(',');

const getKind = (element: Element) => {
  if (element.matches('.fixed.inset-0, [role="dialog"]')) return 'modal';
  if (element.matches('nav, footer')) return 'chrome';
  if (element.matches('form')) return 'form';
  if (element.matches('input, textarea, select')) return 'field';
  if (element.matches('button, a')) return 'control';
  if (element.matches('.kapi-card, [class*="rounded-2xl"][class*="bg-[#16181D]"][class*="border"], [class*="rounded-3xl"][class*="bg-[#16181D]"][class*="border"]')) {
    return 'card';
  }
  return 'section';
};

const setMotionState = (element: Element, state: 'hidden' | 'entering' | 'visible') => {
  (element as HTMLElement).dataset.kapiMotionState = state;
};

const isSpotlightTarget = (element: Element) =>
  element.matches(
    '.kapi-card, [class*="rounded-2xl"][class*="bg-[#16181D]"][class*="border"], [class*="rounded-3xl"][class*="bg-[#16181D]"][class*="border"]'
  );

export const PublicMotion = () => {
  const { pathname } = useLocation();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname.startsWith('/insights/')) return;

    const root = document.querySelector<HTMLElement>('.kapi-public-shell');
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const progress = progressRef.current;
    let rafId = 0;
    let spotlightTarget: HTMLElement | null = null;
    let spotlightRect: DOMRect | null = null;

    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const value = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      if (progress) progress.style.transform = `scaleX(${value})`;
      rafId = 0;
    };

    const requestProgressUpdate = () => {
      if (rafId === 0) rafId = window.requestAnimationFrame(updateProgress);
    };

    const decorate = () => {
      const elements = Array.from(root.querySelectorAll<HTMLElement>(MOTION_SELECTOR)).filter(
        (element) => !element.closest('[data-kapi-motion-static="true"]'),
      );

      elements.forEach((element) => {
        if (element.dataset.kapiMotionBound === 'true') return;
        element.dataset.kapiMotionBound = 'true';
        element.dataset.kapiMotionKind = getKind(element);
        if (isSpotlightTarget(element)) {
          element.dataset.kapiSpotlight = 'true';
        }

        const parent = element.parentElement;
        const siblings = parent
          ? Array.from(parent.children).filter((node) => node instanceof HTMLElement && node.matches(MOTION_SELECTOR))
          : [];
        const index = Math.max(0, siblings.indexOf(element));
        const variant = (index + element.tagName.length) % 4;
        element.style.setProperty('--kapi-motion-delay', `${Math.min(index, 5) * 45}ms`);
        element.dataset.kapiMotionVariant = String(variant);

        if (reducedMotion.matches) {
          setMotionState(element, 'visible');
        } else {
          setMotionState(element, 'hidden');
        }
      });
    };

    decorate();

    const observer = reducedMotion.matches
      ? null
      : new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const element = entry.target as HTMLElement;
            if (!entry.isIntersecting) return;

            setMotionState(element, 'entering');

            const finish = () => {
              setMotionState(element, 'visible');
              element.removeEventListener('animationend', finish);
            };

            element.addEventListener('animationend', finish, { once: true });
            window.setTimeout(() => {
              if (element.dataset.kapiMotionState === 'entering') setMotionState(element, 'visible');
            }, 900);

            observer?.unobserve(element);
          });
        }, {
          threshold: 0.08,
          rootMargin: '0px 0px -8% 0px',
        });

    if (observer) {
      Array.from(root.querySelectorAll<HTMLElement>('[data-kapi-motion-state="hidden"]'))
          .filter((element) => !element.closest('[data-kapi-motion-static="true"]'))
          .forEach((element) => observer.observe(element));
    }

    const mutationObserver = new MutationObserver(() => {
      decorate();
      if (observer) {
        Array.from(root.querySelectorAll<HTMLElement>('[data-kapi-motion-state="hidden"]'))
          .filter((element) => !element.closest('[data-kapi-motion-static="true"]'))
          .forEach((element) => observer.observe(element));
      }
    });

    mutationObserver.observe(root, { childList: true, subtree: true });

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;

      const rawTarget = event.target as Element | null;
      const target = rawTarget?.closest<HTMLElement>('[data-kapi-spotlight="true"]');
      if (!target) return;

      if (target !== spotlightTarget || !spotlightRect) {
        spotlightTarget = target;
        spotlightRect = target.getBoundingClientRect();
      }

      const rect = spotlightRect;
      if (!rect || rect.width === 0 || rect.height === 0) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      target.style.setProperty('--kapi-spotlight-x', Math.max(0, Math.min(100, x)) + '%');
      target.style.setProperty('--kapi-spotlight-y', Math.max(0, Math.min(100, y)) + '%');
    };

    const handleViewportChange = () => {
      spotlightTarget = null;
      spotlightRect = null;
      requestProgressUpdate();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange);
    requestProgressUpdate();

    return () => {
      mutationObserver.disconnect();
      observer?.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  if (pathname.startsWith('/insights/')) return null;

  return <div ref={progressRef} className="kapi-scroll-progress" aria-hidden="true" />;
};
