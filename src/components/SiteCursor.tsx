import * as React from 'react';
import {
  Cursor,
  CursorFollow,
  CursorProvider,
} from './animate-ui/components/animate/cursor';

const getCursorLabel = (element: Element | null) => {
  const custom = element?.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel;
  return custom?.trim() || null;
};

export const SiteCursor = () => {
  const [label, setLabel] = React.useState<string | null>(null);

  React.useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!canHover.matches || reducedMotion.matches) return;

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest('a, button, [role="button"], input, textarea, select');
      if (!interactive) {
        setLabel(null);
        return;
      }
      setLabel(getCursorLabel(target));
    };

    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    return () => window.removeEventListener('pointerover', handlePointerOver);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`kapi-site-cursor-layer${label ? ' is-interactive' : ''}`}
    >
      <CursorProvider global>
        <Cursor />
        {label && (
          <CursorFollow>
            <span className="kapi-cursor-label-content">
              <span className="kapi-cursor-label-accent" aria-hidden="true" />
              <span>{label}</span>
            </span>
          </CursorFollow>
        )}
      </CursorProvider>
    </div>
  );
};
