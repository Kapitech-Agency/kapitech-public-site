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

    const html = document.documentElement;
    html.classList.add('kapi-custom-cursor-enabled');

    const handlePointerMove = (event: PointerEvent) => {
      if (global) {
        setCursorPos({ x: event.clientX, y: event.clientY });
        setActive(true);
      } else if (containerRef.current?.parentElement) {
        const rect = containerRef.current.parentElement.getBoundingClientRect();
        setCursorPos({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
        setActive(true);
      }
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) setActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') setActive(false);
    };

    const target = global ? window : containerRef.current?.parentElement;
    if (!target) return;

    target.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
    target.addEventListener('pointerout', handlePointerLeave as EventListener, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      target.removeEventListener('pointermove', handlePointerMove as EventListener);
      target.removeEventListener('pointerout', handlePointerLeave as EventListener);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      html.classList.remove('kapi-custom-cursor-enabled');
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
  const { cursorPos, active, containerRef, cursorRef, global } = useCursor();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    x.set(cursorPos.x);
    y.set(cursorPos.y);
  }, [cursorPos, x, y]);

  React.useEffect(() => {
    const target = global ? document.documentElement : containerRef.current?.parentElement;
    if (!target || !active) return;

    return () => undefined;
  }, [active, global, containerRef]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          ref={cursorRef}
          data-slot="cursor"
          className="kapi-cursor-pointer"
          style={{
            ...style,
            top: y,
            left: x,
          }}
          initial={{ opacity: 0, scale: 0.65 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.65 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
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
              d="M5.2 2.9C3.5 2.1 1.8 3.5 2.2 5.3l5.1 24.2c.4 1.9 2.9 2.3 4.1.7l4.1-6.2 6.6 4.7c1.5 1.1 3.5-.1 3-1.9l-5.9-18.6a2.1 2.1 0 0 0-1.2-1.3L5.2 2.9Z"
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.62)"
              strokeWidth="1.15"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M17.7 7.8 8.8 25.1"
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type CursorFollowSide = 'top' | 'right' | 'bottom' | 'left';
export type CursorFollowAlign = 'start' | 'center' | 'end';

export type CursorFollowProps = Omit<HTMLMotionProps<'div'>, 'transition'> & {
  side?: CursorFollowSide;
  sideOffset?: number;
  align?: CursorFollowAlign;
  alignOffset?: number;
  transition?: SpringOptions;
  children: React.ReactNode;
};

export function CursorFollow({
  transition = { stiffness: 420, damping: 42, bounce: 0 },
  children,
  style,
  ...props
}: CursorFollowProps) {
  const { cursorPos, active } = useCursor();
  const x = useMotionValue(cursorPos.x + 14);
  const y = useMotionValue(cursorPos.y + 14);
  const springX = useSpring(x, transition);
  const springY = useSpring(y, transition);

  React.useEffect(() => {
    x.set(cursorPos.x + 14);
    y.set(cursorPos.y + 14);
  }, [cursorPos.x, cursorPos.y, x, y]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-slot="cursor-follow"
          className="kapi-cursor-follow"
          style={{
            ...style,
            top: springY,
            left: springX,
          }}
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.72 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
