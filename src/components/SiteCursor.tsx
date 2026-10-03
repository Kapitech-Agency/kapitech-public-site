import * as React from 'react';
import {
  Cursor,
  CursorFollow,
  CursorProvider,
} from './animate-ui/components/animate/cursor';

const interactiveSelector = 'a, button, [role="button"], input, textarea, select';

const getInteractiveElement = (target: EventTarget | null) => {
  const element = target instanceof Element ? target : null;
  return element?.closest<HTMLElement>(interactiveSelector) ?? null;
};

const getCursorLabel = (element: Element | null) => {
  const custom = element?.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel;
  return custom?.trim() || null;
};

export const SiteCursor = () => {
  const [label, setLabel] = React.useState<string | null>(null);
  const currentInteractiveRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateLabelFromTarget = (target: EventTarget | null) => {
      if (!canHover.matches || reducedMotion.matches) return;

      const interactive = getInteractiveElement(target);

      if (interactive === currentInteractiveRef.current) return;

      currentInteractiveRef.current = interactive;
      setLabel(interactive ? getCursorLabel(interactive) : null);
    };

    const handlePointerOver = (event: PointerEvent) => {
      updateLabelFromTarget(event.target);
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        currentInteractiveRef.current = null;
        setLabel(null);
        return;
      }

      updateLabelFromTarget(event.relatedTarget);
    };

    const handleModeChange = () => {
      if (!canHover.matches || reducedMotion.matches) {
        currentInteractiveRef.current = null;
        setLabel(null);
      }
    };

    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    const handleWindowBlur = () => {
      currentInteractiveRef.current = null;
      setLabel(null);
    };

    window.addEventListener('pointerout', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handleWindowBlur, { passive: true });
    canHover.addEventListener('change', handleModeChange);
    reducedMotion.addEventListener('change', handleModeChange);

    return () => {
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerout', handlePointerLeave);
      window.removeEventListener('blur', handleWindowBlur);
      canHover.removeEventListener('change', handleModeChange);
      reducedMotion.removeEventListener('change', handleModeChange);
      currentInteractiveRef.current = null;
      setLabel(null);
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
