'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type HTMLMotionProps,
  type SpringOptions,
} from 'motion/react';

type CursorContextType = {
  cursorPos: { x: number; y: number };
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
  const [cursorPos, setCursorPos] = React.useState({ x: 0, y: 0 });
  const [active, setActive] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const cursorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldEnable = canHover && !reducedMotion;
    setEnabled(shouldEnable);

    if (!shouldEnable) return;

    const root = document.documentElement;
    root.classList.add('kapi-custom-cursor-enabled');

    const handlePointerMove = (event: PointerEvent) => {
      if (global) {
        setCursorPos({ x: event.clientX, y: event.clientY });
        setActive(true);
        return;
      }

      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      setCursorPos({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      setActive(true);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) setActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') setActive(false);
    };

    const target = global ? window : containerRef.current?.parentElement;
    if (!target) return;

    target.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
    target.addEventListener('pointerout', handlePointerOut as EventListener, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      target.removeEventListener('pointermove', handlePointerMove as EventListener);
      target.removeEventListener('pointerout', handlePointerOut as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      root.classList.remove('kapi-custom-cursor-enabled');
    };
  }, [global]);

  return (
    <CursorContext.Provider value={{ cursorPos, active: enabled && active, global, containerRef, cursorRef }}>
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
  const x = useMotionValue(cursorPos.x);
  const y = useMotionValue(cursorPos.y);
  const springX = useSpring(x, { stiffness: 900, damping: 58, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 900, damping: 58, mass: 0.35 });

  React.useEffect(() => {
    x.set(cursorPos.x);
    y.set(cursorPos.y);
  }, [cursorPos.x, cursorPos.y, x, y]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          ref={cursorRef}
          data-slot="cursor"
          className="kapi-cursor-pointer"
          style={{ ...style, top: springY, left: springX }}
          initial={{ opacity: 0, scale: 0.84 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.84 }}
          transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
          {...props}
        >
          <svg
            className="kapi-cursor-svg"
            viewBox="0 0 30 34"
            width="30"
            height="34"
            aria-hidden="true"
          >
            <path
              d="M5.25 2.95C3.57 2.18 1.82 3.56 2.2 5.38l5.08 24.1c.4 1.9 2.86 2.35 4.04.73l4.18-5.98 6.55 4.65c1.52 1.08 3.48-.25 2.93-1.98L19.1 8.36a2.1 2.1 0 0 0-1.16-1.31L5.25 2.95Z"
              fill="#FFFFFF"
              stroke="#101216"
              strokeWidth="1.3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type CursorFollowProps = Omit<HTMLMotionProps<'div'>, 'transition'> & {
  transition?: SpringOptions;
  children: React.ReactNode;
};

export function CursorFollow({
  transition = { stiffness: 760, damping: 54, mass: 0.35 },
  children,
  style,
  ...props
}: CursorFollowProps) {
  const { cursorPos, active } = useCursor();
  const x = useMotionValue(cursorPos.x + 12);
  const y = useMotionValue(cursorPos.y + 40);
  const springX = useSpring(x, transition);
  const springY = useSpring(y, transition);

  React.useEffect(() => {
    x.set(cursorPos.x + 12);
    y.set(cursorPos.y + 40);
  }, [cursorPos.x, cursorPos.y, x, y]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-slot="cursor-follow"
          className="kapi-cursor-follow"
          style={{ ...style, top: springY, left: springX }}
          initial={{ opacity: 0, scale: 0.78 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.78 }}
          transition={{ duration: 0.13, ease: [0.22, 1, 0.36, 1] }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
