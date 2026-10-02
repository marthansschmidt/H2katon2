import { ArrowLeft, X } from 'lucide-react';
import type { ReactNode } from 'react';

export function MobileHeader({ title, onBack, onClose, action, className = '' }: {
  title: ReactNode; onBack?: () => void; onClose?: () => void; action?: ReactNode; className?: string;
}) {
  return <header className={`mobile-header ${className}`}>
    {onBack && <button className="icon-button" onClick={onBack} aria-label="Tagasi"><ArrowLeft size={22} /></button>}
    <div className="mobile-header-title">{typeof title === 'string' ? <h2>{title}</h2> : title}</div>
    {onClose ? <button className="icon-button" onClick={onClose} aria-label="Sulge"><X size={22} /></button> : action}
  </header>;
}
