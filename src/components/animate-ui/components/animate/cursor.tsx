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
    <CursorContext.Provider value={{ cursorPos, active: enabled && active, global, containerRef }}>
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
  const { cursorPos, active, containerRef, global } = useCursor();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    x.set(cursorPos.x);
    y.set(cursorPos.y);
  }, [cursorPos, x, y]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
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
            viewBox="0 0 34 38"
            width="34"
            height="38"
            aria-hidden="true"
          >
            <path
              d="M6.1 2.9c-1.55-.58-3.08.78-2.72 2.39l6.36 28.03c.32 1.43 2.21 1.86 3.13.72l4.16-5.2 7.05 5.07c1.25.9 2.94-.34 2.51-1.82L19.4 9.08a2.1 2.1 0 0 0-1.27-1.37L6.1 2.9Z"
              fill="#F8FAFC"
              stroke="#111318"
              strokeWidth="1.25"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M17.03 7.65 10.95 24.96"
              fill="none"
              stroke="#111318"
              strokeWidth="1.15"
              strokeLinecap="round"
              opacity="0.42"
            />
            <path
              d="M17.03 7.65 20.16 17.56"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.85"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M21.2 25.16 24.6 27.6"
              fill="none"
              stroke="#111318"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.3"
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
  transition = { stiffness: 500, damping: 44, bounce: 0 },
  children,
  style,
  ...props
}: CursorFollowProps) {
  const { cursorPos, active } = useCursor();
  const x = useMotionValue(cursorPos.x + 14);
  const y = useMotionValue(cursorPos.y + 48);
  const springX = useSpring(x, transition);
  const springY = useSpring(y, transition);

  React.useEffect(() => {
    x.set(cursorPos.x + 14);
    y.set(cursorPos.y + 48);
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
