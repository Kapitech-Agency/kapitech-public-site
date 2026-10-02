import * as React from 'react';
import {
  Cursor,
  CursorFollow,
  CursorProvider,
} from './animate-ui/components/animate/cursor';

const getCursorLabel = (element: Element | null) => {
  if (!element) return 'Explore';
  const custom = element.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel;
  if (custom) return custom;
  if (element.closest('a')) return 'Open';
  if (element.closest('button')) return 'Select';
  return 'Explore';
};

export const SiteCursor = () => {
  const [label, setLabel] = React.useState('Explore');

  React.useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!canHover.matches || reducedMotion.matches) return;

    const handlePointerOver = (event: PointerEvent) => {
      setLabel(getCursorLabel(event.target as Element | null));
    };

    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    return () => window.removeEventListener('pointerover', handlePointerOver);
  }, []);

  return (
    <div aria-hidden="true" className="kapi-site-cursor-layer">
      <CursorProvider global>
        <Cursor />
        <CursorFollow
          side="bottom"
          sideOffset={18}
          align="end"
          alignOffset={6}
        >
          {label}
        </CursorFollow>
      </CursorProvider>
    </div>
  );
};
