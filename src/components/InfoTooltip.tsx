import { useState, type FocusEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

export function useInfoTooltip() {
  const [visible, setVisible] = useState(false);
  const hide = () => setVisible(false);
  return {
    visible,
    toggle: () => setVisible(value => !value),
    hide,
    triggerProps: {
      onPointerEnter: (event: PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') setVisible(true); },
      onPointerLeave: (event: PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') hide(); },
      onFocus: (event: FocusEvent<HTMLElement>) => { if ((event.target as HTMLElement).matches(':focus-visible')) setVisible(true); },
      onBlur: hide,
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape' && visible) { event.preventDefault(); event.stopPropagation(); hide(); }
      },
    },
  };
}

export function InfoTooltip({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return <span className={`game-tooltip ${className}`} role="tooltip" id={id}>{children}</span>;
}
