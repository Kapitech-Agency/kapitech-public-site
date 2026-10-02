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

      setLabel(getCursorLabel(interactive));
    };

    const handlePointerLeave = (event: PointerEvent) => {
      const next = event.relatedTarget as Element | null;
      const nextInteractive = next?.closest('a, button, [role="button"], input, textarea, select');
      if (!nextInteractive) setLabel(null);
    };

    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerout', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="kapi-site-cursor-layer">
      <CursorProvider global>
        <Cursor />
        {label && <CursorFollow>{label}</CursorFollow>}
      </CursorProvider>
    </div>
  );
};
