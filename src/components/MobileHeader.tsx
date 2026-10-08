import { ArrowLeft, Xmark } from './Icons';
import type { ReactNode } from 'react';

export function MobileHeader({ title, onBack, onClose, showCloseButton = true, action, className = '' }: {
  title: ReactNode; onBack?: () => void; onClose?: () => void; showCloseButton?: boolean; action?: ReactNode; className?: string;
}) {
  return <header className={`mobile-header ${className}${onClose ? ' has-close' : ''}`}>
    {onBack && !onClose && <button className="icon-button" onClick={onBack} aria-label="Tagasi"><ArrowLeft size={22} /></button>}
    <div className="mobile-header-title">{typeof title === 'string' ? <h2>{title}</h2> : title}</div>
    {onClose ? showCloseButton && <button className="icon-button" onClick={onClose} aria-label="Sulge"><Xmark size={22} /></button> : action}
  </header>;
}
