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
          <span className="kapi-cursor-dot" />
          <span className="kapi-cursor-ring" />
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
  side = 'bottom',
  sideOffset = 15,
  align = 'end',
  alignOffset = 5,
  transition = { stiffness: 500, damping: 50, bounce: 0 },
  children,
  style,
  ...props
}: CursorFollowProps) {
  const { cursorPos, active, cursorRef, global } = useCursor();
  const followRef = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, transition);
  const springY = useSpring(y, transition);

  const calculateOffset = React.useCallback(() => {
    const rect = followRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 0;
    const height = rect?.height ?? 0;
    let offsetX = 0;
    let offsetY = 0;

    switch (side) {
      case 'top':
        offsetY = height + sideOffset;
        break;
      case 'bottom':
        offsetY = -sideOffset;
        break;
      case 'left':
        offsetX = width + sideOffset;
        break;
      case 'right':
        offsetX = -sideOffset;
        break;
    }

    if (side === 'top' || side === 'bottom') {
      offsetX = align === 'center' ? width / 2 : align === 'start' ? width + alignOffset : -alignOffset;
    } else {
      offsetY = align === 'center' ? height / 2 : align === 'start' ? height + alignOffset : -alignOffset;
    }

    return { x: offsetX, y: offsetY };
  }, [align, alignOffset, side, sideOffset]);

  React.useEffect(() => {
    const offset = calculateOffset();
    const cursorRect = cursorRef.current?.getBoundingClientRect();
    const cursorWidth = cursorRect?.width ?? 22;
    const cursorHeight = cursorRect?.height ?? 22;

    x.set(cursorPos.x - offset.x + cursorWidth / 2);
    y.set(cursorPos.y - offset.y + cursorHeight / 2);
  }, [calculateOffset, cursorPos, cursorRef, x, y]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          ref={followRef}
          data-slot="cursor-follow"
          className="kapi-cursor-follow"
          style={{
            ...style,
            top: springY,
            left: springX,
          }}
          initial={{ opacity: 0, scale: 0.85, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 4 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
