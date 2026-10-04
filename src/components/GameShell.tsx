import { CircleHelp, Home, Settings, X } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import type { Screen } from '../types/game';
import { MobileHeader } from './MobileHeader';
import { RaccoonCharacter } from './RaccoonCharacter';

export function GameShell({ screen, children, mainRef, menuOpen, onMenu, onHome, onTutorial }: {
  screen: Screen; children: ReactNode; mainRef: Ref<HTMLDivElement>; menuOpen: boolean;
  onMenu: () => void; onHome: () => void; onTutorial: () => void;
}) {
  return <div className={`app-shell screen-${screen}`}>
    <a className="skip-link" href="#main-content">Liigu põhisisuni</a>
    {screen !== 'home' && <div className="site-header">
      <MobileHeader title={<button className="brand" onClick={onHome} aria-label="Toiduseiklus, peamenüü">
        <span className="brand-icon"><RaccoonCharacter small /></span>
        <span>TOIDUSEIKLUS</span>
      </button>} action={<button className="icon-button mobile-menu-button" onClick={onMenu} aria-label={menuOpen ? 'Sulge menüü' : 'Ava menüü'} aria-expanded={menuOpen} aria-controls="game-menu">
        {menuOpen ? <X size={21} /> : <Settings size={21} />}
      </button>} />
      {menuOpen && <nav id="game-menu" className="game-menu" aria-label="Peamenüü">
        <button onClick={onHome}><Home size={20} />Avaleht</button>
        <button onClick={onTutorial}><CircleHelp size={20} />Kuidas mängida?</button>
      </nav>}
    </div>}
    <div id="main-content" className="main-container" tabIndex={-1} ref={mainRef}>{children}</div>
    <footer className="site-footer">Väikesed valikud, suured avastused. <span>Tartu · 16–19</span></footer>
  </div>;
}
