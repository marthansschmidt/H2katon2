import { useEffect, useRef, type ReactNode } from 'react';
import { MobileHeader } from './MobileHeader';
export function Modal({ title, headerTitle, children, onClose, wide = false, className = '' }: { title: string; headerTitle?: ReactNode; children: ReactNode; onClose: () => void; wide?: boolean; className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const focused = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog?.close(); document.body.style.overflow = previousOverflow; focused?.focus(); };
  }, []);
  return <dialog ref={dialogRef} className={`modal ${wide ? 'modal-wide' : ''} ${className}`} aria-label={title} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialogRef.current) { const rect = dialogRef.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }}>
    <MobileHeader className="modal-heading" title={headerTitle ?? title} onBack={wide ? onClose : undefined} onClose={onClose} />
    {children}
  </dialog>;
}
