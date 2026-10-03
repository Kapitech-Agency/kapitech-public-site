'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  type HTMLMotionProps,
  type MotionValue,
} from 'motion/react';

type CursorContextType = {
  cursorPos: { x: MotionValue<number>; y: MotionValue<number> };
  active: boolean;
  global: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  cursorRef: React.RefObject<HTMLDivElement | null>;
};

const CursorContext = React.createContext<CursorContextType | null>(null);

function useCursor() {
  const context = React.useContext(CursorContext);
  if (!context) throw new Error('Cursor components must be used within CursorProvider.');
  return context;
}

export type CursorProviderProps = {
  children: React.ReactNode;
  global?: boolean;
};

export function CursorProvider({ children, global = false }: CursorProviderProps) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [enabled, setEnabled] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef(false);
  const cursorRef = React.useRef<HTMLDivElement>(null);
  const mediaHoverRef = React.useRef<MediaQueryList | null>(null);
  const mediaReducedRef = React.useRef<MediaQueryList | null>(null);

  React.useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaHoverRef.current = canHover;
    mediaReducedRef.current = reducedMotion;

    const root = document.documentElement;
    const updateAvailability = () => {
      const shouldEnable = canHover.matches && !reducedMotion.matches;
      setEnabled(shouldEnable);

      if (shouldEnable) {
        root.classList.add('kapi-custom-cursor-enabled');
      } else {
        root.classList.remove('kapi-custom-cursor-enabled');
        setCursorActive(false);
        cursorX.set(-100);
        cursorY.set(-100);
      }
    };

    const setCursorActive = (nextActive: boolean) => {
      if (activeRef.current === nextActive) return;
      activeRef.current = nextActive;
      setActive(nextActive);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canHover.matches || reducedMotion.matches) return;

      if (!global) {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        cursorX.set(event.clientX - rect.left);
        cursorY.set(event.clientY - rect.top);
      } else {
        cursorX.set(event.clientX);
        cursorY.set(event.clientY);
      }

      setCursorActive(true);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) setCursorActive(false);
    };

    const handlePointerCancel = () => setCursorActive(false);
    const handleWindowBlur = () => setCursorActive(false);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') setCursorActive(false);
    };

    const handleAvailabilityChange = () => updateAvailability();

    updateAvailability();
    canHover.addEventListener('change', handleAvailabilityChange);
    reducedMotion.addEventListener('change', handleAvailabilityChange);

    const target = global ? window : containerRef.current?.parentElement;
    target?.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
    target?.addEventListener('pointerout', handlePointerOut as EventListener, { passive: true });
    target?.addEventListener('pointercancel', handlePointerCancel as EventListener, { passive: true });
    window.addEventListener('blur', handleWindowBlur, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      canHover.removeEventListener('change', handleAvailabilityChange);
      reducedMotion.removeEventListener('change', handleAvailabilityChange);
      const target = global ? window : containerRef.current?.parentElement;
      target?.removeEventListener('pointermove', handlePointerMove as EventListener);
      target?.removeEventListener('pointerout', handlePointerOut as EventListener);
      target?.removeEventListener('pointercancel', handlePointerCancel as EventListener);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      root.classList.remove('kapi-custom-cursor-enabled');
      mediaHoverRef.current = null;
      mediaReducedRef.current = null;
    };
  }, [cursorX, cursorY, global]);

  return (
    <CursorContext.Provider
      value={{
        cursorPos: { x: cursorX, y: cursorY },
        active: enabled && active,
        global,
        containerRef,
        cursorRef,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export type CursorContainerProps = HTMLMotionProps<'div'> & {
  asChild?: boolean;
};

export function CursorContainer({ children, ...props }: CursorContainerProps) {
  const { containerRef } = useCursor();
  return (
    <motion.div ref={containerRef} data-slot="cursor-container" {...props}>
      {children}
    </motion.div>
  );
}

export type CursorProps = HTMLMotionProps<'div'> & {
  asChild?: boolean;
};

export function Cursor({ children, style, ...props }: CursorProps) {
  const { cursorPos, active, cursorRef } = useCursor();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          ref={cursorRef}
          data-slot="cursor"
          className="kapi-cursor-pointer"
          style={{ ...style, left: 0, top: 0, x: cursorPos.x, y: cursorPos.y }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.07, ease: 'linear' }}
          {...props}
        >
          <svg
            className="kapi-cursor-svg"
            viewBox="0 0 30 34"
            width="30"
            height="34"
            aria-hidden="true"
          >
            <g transform="translate(-2.2 -2.95)">
              <path
                d="M5.25 2.95C3.57 2.18 1.82 3.56 2.2 5.38l5.08 24.1c.4 1.9 2.86 2.35 4.04.73l4.18-5.98 6.55 4.65c1.52 1.08 3.48-.25 2.93-1.98L19.1 8.36a2.1 2.1 0 0 0-1.16-1.31L5.25 2.95Z"
                fill="#FFFFFF"
                stroke="#111318"
                strokeWidth="1.25"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M6.4 6.1 10.9 27.5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.9"
                strokeLinecap="round"
                opacity="0.48"
              />
            </g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type CursorFollowProps = Omit<HTMLMotionProps<'div'>, 'transition'> & {
  children: React.ReactNode;
};

export function CursorFollow({ children, style, ...props }: CursorFollowProps) {
  const { cursorPos, active } = useCursor();

  const labelX = useTransform(cursorPos.x, (value) => {
    if (typeof window === 'undefined') return value + 12;
    const rightBound = Math.max(8, window.innerWidth - 152);
    return value > window.innerWidth - 180 ? Math.max(8, value - 152) : Math.min(value + 12, rightBound);
  });

  const labelY = useTransform(cursorPos.y, (value) => {
    if (typeof window === 'undefined') return value + 46;
    const bottomBound = Math.max(8, window.innerHeight - 30);
    return value > window.innerHeight - 82 ? Math.max(8, value - 30) : Math.min(value + 46, bottomBound);
  });

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-slot="cursor-follow"
          className="kapi-cursor-follow"
          style={{ ...style, left: 0, top: 0, x: labelX, y: labelY }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.08, ease: 'linear' }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
