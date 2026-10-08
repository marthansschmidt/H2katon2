import { useEffect, useRef, type ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
export function Modal({ title, headerTitle, children, onClose, wide = false, dismissible = true, showCloseButton = true, className = '' }: { title: string; headerTitle?: ReactNode; children: ReactNode; onClose: () => void; wide?: boolean; dismissible?: boolean; showCloseButton?: boolean; className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const focused = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    if (dialog && !dismissible) {
      dialog.focus({ preventScroll: true });
      dialog.scrollTop = 0;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; focused?.focus(); };
  }, [dismissible]);
  return <dialog ref={dialogRef} className={`modal ${wide ? 'modal-wide' : ''} ${className}`} aria-label={title} onCancel={event => { event.preventDefault(); if (dismissible) onClose(); }} onClick={event => { if (dismissible && event.target === dialogRef.current) { const rect = dialogRef.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <MobileHeader className="modal-heading" title={headerTitle ?? title} onBack={wide && dismissible ? onClose : undefined} onClose={dismissible ? onClose : undefined} showCloseButton={showCloseButton} />
    {children}
  </dialog>;
}
