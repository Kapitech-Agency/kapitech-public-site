import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const MOTION_EASE = {
  standard: 'power3.out',
  smooth: 'power4.out',
  reveal: 'power4.inOut',
  cinematic: 'expo.out',
  spring: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.45)',
};

export const MOTION_DURATION = {
  micro: 0.18,
  fast: 0.34,
  standard: 0.62,
  slow: 0.9,
  cinematic: 1.35,
  ambient: 10,
};

type MotionContextValue = {
  reducedMotion: boolean;
};

const MotionContext = createContext<MotionContextValue>({ reducedMotion: false });

export const useMotion = () => useContext(MotionContext);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function setupGlobalScenes(root: HTMLElement | null, reducedMotion: boolean) {
  if (!root || reducedMotion) return () => undefined;

  const cleanups: Array<() => void> = [];

  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-motion-reveal]').forEach((element) => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y: 56,
          clipPath: 'inset(0 0 100% 0 round 0px)',
          filter: 'blur(8px)',
        },
        {
          autoAlpha: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0 round 0px)',
          filter: 'blur(0px)',
          duration: parseFloat(element.dataset.motionDuration || '0.95'),
          ease: MOTION_EASE.reveal,
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            once: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-motion-line]').forEach((element) => {
      gsap.fromTo(
        element,
        { scaleX: 0, transformOrigin: element.dataset.motionOrigin || 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: MOTION_EASE.reveal,
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            once: true,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-motion-parallax]').forEach((element) => {
      const strength = parseFloat(element.dataset.motionParallax || '10');

      gsap.fromTo(
        element,
        { yPercent: -strength * 0.55 },
        {
          yPercent: strength * 0.55,
          ease: 'none',
          scrollTrigger: {
            trigger: element.closest('[data-motion-parallax-root]') || element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-motion-scale-scroll]').forEach((element) => {
      gsap.fromTo(
        element,
        {
          scale: parseFloat(element.dataset.motionScaleStart || '1.08'),
          yPercent: parseFloat(element.dataset.motionScaleY || '2'),
        },
        {
          scale: 1,
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'center center',
            scrub: 1.1,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-motion-fade-scroll]').forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 1, yPercent: 0 },
        {
          autoAlpha: 0,
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top top+=12%',
            end: '+=42%',
            scrub: 1,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-motion-pin]').forEach((element) => {
      const distance = element.dataset.motionPinDistance || '+=900';
      ScrollTrigger.create({
        trigger: element,
        start: 'top top+=12%',
        end: distance,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-motion-section]').forEach((section) => {
      const aura = section.querySelector<HTMLElement>('[data-motion-section-aura]');
      if (!aura) return;

      gsap.fromTo(
        aura,
        { opacity: 0.14, scale: 0.84, yPercent: 6 },
        {
          opacity: 0.34,
          scale: 1.04,
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>('[data-motion-surface]').forEach((surface) => {
      const glowX = gsap.quickTo(surface, '--surface-x', { duration: 0.55, ease: 'power3.out' });
      const glowY = gsap.quickTo(surface, '--surface-y', { duration: 0.55, ease: 'power3.out' });
      const lift = gsap.quickTo(surface, '--surface-lift', { duration: 0.45, ease: MOTION_EASE.spring });

      const onMove = (event: PointerEvent) => {
        const rect = surface.getBoundingClientRect();
        const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        glowX(px * 100);
        glowY(py * 100);
        lift(1);
      };

      const onLeave = () => {
        glowX(50);
        glowY(50);
        lift(0);
      };

      surface.addEventListener('pointermove', onMove, { passive: true });
      surface.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        surface.removeEventListener('pointermove', onMove);
        surface.removeEventListener('pointerleave', onLeave);
      });
    });

    ScrollTrigger.refresh();
  }, root);

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    ctx.revert();
  };
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const location = useLocation();

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.075,
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.05,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (!rootRef.current) return undefined;
    return setupGlobalScenes(rootRef.current, reducedMotion);
  }, [location.pathname, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const images = Array.from(document.images);
    let settled = false;

    const refresh = () => {
      if (settled) return;
      settled = true;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    if (document.fonts?.ready) {
      void document.fonts.ready.then(refresh);
    }

    if (images.length === 0) {
      refresh();
      return;
    }

    let pending = images.length;
    const done = () => {
      pending -= 1;
      if (pending <= 0) refresh();
    };

    images.forEach((image) => {
      if (image.complete) {
        done();
      } else {
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      }
    });

    const timeout = window.setTimeout(refresh, 2200);

    return () => window.clearTimeout(timeout);
  }, [location.pathname, reducedMotion]);

  return (
    <MotionContext.Provider value={{ reducedMotion }}>
      <div ref={rootRef} className="kapi-motion-root">
        {children}
      </div>
    </MotionContext.Provider>
  );
}

export function SplitWords({
  text,
  className = '',
  highlight,
}: {
  text: string;
  className?: string;
  highlight?: string[];
}) {
  const highlights = useMemo(() => new Set(highlight || []), [highlight]);

  return (
    <span className={className} aria-label={text}>
      {text.split(/\s+/).map((word, index) => (
        <span
          key={`${word}-${index}`}
          className={`kapi-word ${highlights.has(word) ? 'kapi-word--accent' : ''}`}
        >
          <span className="kapi-word-inner">{word}</span>
        </span>
      ))}
    </span>
  );
}

export function CinematicText({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    if (!ref.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 34, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' },
        {
          y: 0,
          autoAlpha: 1,
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.1,
          delay,
          ease: MOTION_EASE.cinematic,
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, reducedMotion]);

  return <div ref={ref} className={className}>{children}</div>;
}

export function Magnetic({
  children,
  strength = 0.22,
  className = '',
  as = 'span',
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  as?: 'span' | 'div';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || isTouchDevice()) return undefined;

    const xTo = gsap.quickTo(element, 'x', { duration: 0.38, ease: MOTION_EASE.spring });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.38, ease: MOTION_EASE.spring });

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) * strength;
      const dy = (event.clientY - (rect.top + rect.height / 2)) * strength;
      xTo(clamp(dx, -14, 14));
      yTo(clamp(dy, -12, 12));
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('pointermove', onMove, { passive: true });
    element.addEventListener('pointerleave', onLeave);

    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion, strength]);

  if (as === 'div') {
    return <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>{children}</div>;
  }

  return <span ref={ref as React.RefObject<HTMLSpanElement>} className={className}>{children}</span>;
}

export function MagneticAnchor({
  href,
  children,
  strength = 0.18,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const { reducedMotion } = useMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || isTouchDevice()) return undefined;

    const xTo = gsap.quickTo(element, 'x', { duration: 0.4, ease: MOTION_EASE.spring });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.4, ease: MOTION_EASE.spring });

    const onMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      xTo(clamp((event.clientX - (rect.left + rect.width / 2)) * strength, -10, 10));
      yTo(clamp((event.clientY - (rect.top + rect.height / 2)) * strength, -8, 8));
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener('pointermove', onMove, { passive: true });
    element.addEventListener('pointerleave', reset);

    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', reset);
    };
  }, [reducedMotion, strength]);

  return <a ref={ref} href={href} className={className}>{children}</a>;
}

export function InteractiveMedia({
  src,
  alt,
  className = '',
  imageClassName = '',
  cursorLabel = 'View',
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  cursorLabel?: string;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const image = useRef<HTMLImageElement | null>(null);
  const sheen = useRef<HTMLSpanElement | null>(null);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    const container = root.current;
    const img = image.current;
    const shine = sheen.current;
    if (!container || !img || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        {
          clipPath: 'inset(10% 0 10% 0 round 16px)',
        },
        {
          clipPath: 'inset(0% 0 0% 0 round 16px)',
          duration: 1.15,
          ease: MOTION_EASE.reveal,
          scrollTrigger: {
            trigger: container,
            start: 'top 88%',
            once: true,
          },
        },
      );

      gsap.fromTo(
        img,
        { scale: 1.12, yPercent: 3 },
        {
          scale: 1,
          yPercent: 0,
          duration: 1.55,
          ease: MOTION_EASE.cinematic,
          scrollTrigger: {
            trigger: container,
            start: 'top 92%',
            once: true,
          },
        },
      );
    }, root);

    const xTo = gsap.quickTo(img, 'xPercent', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(img, 'yPercent', { duration: 0.7, ease: 'power3.out' });
    const rotateXTo = gsap.quickTo(container, 'rotationX', { duration: 0.7, ease: 'power3.out' });
    const rotateYTo = gsap.quickTo(container, 'rotationY', { duration: 0.7, ease: 'power3.out' });
    gsap.set(container, { transformPerspective: 900, transformOrigin: 'center center' });
    const sheenX = shine ? gsap.quickTo(shine, 'xPercent', { duration: 0.5, ease: 'power3.out' }) : null;
    const sheenY = shine ? gsap.quickTo(shine, 'yPercent', { duration: 0.5, ease: 'power3.out' }) : null;

    const onMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      xTo((px - 0.5) * -3.8);
      yTo((py - 0.5) * -3.8);
      rotateXTo((0.5 - py) * 2.4);
      rotateYTo((px - 0.5) * 3.1);
      sheenX?.((px - 0.5) * 110);
      sheenY?.((py - 0.5) * 75);
      container.style.setProperty('--pointer-x', `${px * 100}%`);
      container.style.setProperty('--pointer-y', `${py * 100}%`);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      rotateXTo(0);
      rotateYTo(0);
      sheenX?.(0);
      sheenY?.(0);
      container.style.setProperty('--pointer-x', '50%');
      container.style.setProperty('--pointer-y', '50%');
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerleave', onLeave);

    return () => {
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={root}
      className={`kapi-interactive-media ${className}`}
      data-cursor="project"
      data-cursor-text={cursorLabel}
      style={{ '--pointer-x': '50%', '--pointer-y': '50%' } as React.CSSProperties}
    >
      <img ref={image} src={src} alt={alt} loading="lazy" decoding="async" className={imageClassName} />
      <span ref={sheen} className="kapi-interactive-media__sheen" aria-hidden="true" />
      <span className="kapi-interactive-media__frame" aria-hidden="true" />
    </div>
  );
}

export function ParallaxMedia({
  children,
  className = '',
  strength = 12,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    if (!ref.current || reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { yPercent: -strength },
        {
          yPercent: strength,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.25,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [reducedMotion, strength]);

  return <div ref={ref} className={className}>{children}</div>;
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    if (!ref.current) return undefined;

    const target = { value: 0 };
    const ctx = gsap.context(() => {
      gsap.to(target, {
        value,
        duration: reducedMotion ? 0.2 : 1.45,
        ease: 'power3.out',
        scrollTrigger: reducedMotion
          ? undefined
          : {
              trigger: ref.current,
              start: 'top 90%',
              once: true,
            },
        onUpdate: () => {
          if (!ref.current) return;
          ref.current.textContent = `${prefix}${target.value.toFixed(decimals)}${suffix}`;
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [decimals, prefix, reducedMotion, suffix, value]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}

export function ContextCursor() {
  const { reducedMotion } = useMotion();
  const ring = useRef<HTMLDivElement | null>(null);
  const text = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef('');

  useEffect(() => {
    if (reducedMotion || isTouchDevice()) return undefined;
    const ringEl = ring.current;
    const textEl = text.current;
    if (!ringEl || !textEl) return undefined;

    const xTo = gsap.quickTo(ringEl, 'x', { duration: 0.34, ease: 'power3.out' });
    const yTo = gsap.quickTo(ringEl, 'y', { duration: 0.34, ease: 'power3.out' });
    const scaleTo = gsap.quickTo(ringEl, 'scale', { duration: 0.28, ease: MOTION_EASE.spring });
    const opacityTo = gsap.quickTo(ringEl, 'opacity', { duration: 0.2, ease: 'power2.out' });

    const onMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      opacityTo(1);
    };

    const setMode = (target: Element | null) => {
      const element = target?.closest<HTMLElement>('[data-cursor]') || null;
      const mode = element?.dataset.cursor || '';
      const cursorText = element?.dataset.cursorText || '';
      labelRef.current = cursorText;
      textEl.textContent = cursorText;
      ringEl.dataset.mode = mode;
      scaleTo(mode === 'project' ? 1.9 : mode === 'drag' ? 2.3 : mode === 'button' ? 1.45 : 1);
      ringEl.classList.toggle('has-label', Boolean(cursorText));
    };

    const onOver = (event: PointerEvent) => setMode(event.target as Element);
    const onOut = (event: PointerEvent) => setMode(event.relatedTarget as Element);

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
    };
  }, [reducedMotion]);

  if (reducedMotion || isTouchDevice()) return null;

  return (
    <div className="kapi-context-cursor" aria-hidden="true">
      <div ref={ring} className="kapi-context-cursor__ring">
        <span ref={text} />
      </div>
    </div>
  );
}

export function PageCurtain() {
  const { pathname } = useLocation();
  const curtain = useRef<HTMLDivElement | null>(null);
  const previous = useRef(pathname);
  const { reducedMotion } = useMotion();

  useLayoutEffect(() => {
    const element = curtain.current;
    if (!element || reducedMotion || previous.current === pathname) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.set(element, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 1 })
        .to(element, { clipPath: 'inset(0 0% 0 0)', duration: 0.38, ease: MOTION_EASE.cinematic })
        .to(element, { clipPath: 'inset(0 0% 0 100%)', duration: 0.58, delay: 0.06, ease: MOTION_EASE.cinematic })
        .set(element, { autoAlpha: 0 });
    }, curtain);

    previous.current = pathname;
    return () => ctx.revert();
  }, [pathname, reducedMotion]);

  return <div ref={curtain} className="kapi-page-curtain" aria-hidden="true" />;
}
