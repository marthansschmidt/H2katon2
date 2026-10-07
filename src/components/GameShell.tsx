import { HelpCircle, HomeSimple, Settings, Xmark } from './Icons';
import type { ReactNode, Ref } from 'react';
import type { Screen } from '../types/game';
import { MobileHeader } from './MobileHeader';
import { GameCharacter } from './GameCharacter';

export function GameShell({ screen, children, mainRef, menuOpen, onMenu, onHome, onTutorial }: {
  screen: Screen; children: ReactNode; mainRef: Ref<HTMLDivElement>; menuOpen: boolean;
  onMenu: () => void; onHome: () => void; onTutorial: () => void;
}) {
  return <div className={`app-shell screen-${screen}`}>
    <a className="skip-link" href="#main-content">Liigu põhisisuni</a>
    {screen !== 'home' && screen !== 'final' && <div className="site-header">
      <MobileHeader title={<button className="brand" onClick={onHome} aria-label="Toiduseiklus, peamenüü">
        <span className="brand-icon"><GameCharacter small pose="wave" /></span>
        <span>TOIDUSEIKLUS</span>
      </button>} action={<button className="icon-button mobile-menu-button" onClick={onMenu} aria-label={menuOpen ? 'Sulge menüü' : 'Ava menüü'} aria-expanded={menuOpen} aria-controls="game-menu">
        {menuOpen ? <Xmark size={21} /> : <Settings size={21} />}
      </button>} />
      {menuOpen && <nav id="game-menu" className="game-menu" aria-label="Peamenüü">
        <button onClick={onHome}><HomeSimple size={20} />Avaleht</button>
        <button onClick={onTutorial}><HelpCircle size={20} />Kuidas mängida?</button>
      </nav>}
    </div>}
    <div id="main-content" className="main-container" tabIndex={-1} ref={mainRef}>{children}</div>
    <footer className="site-footer">Väikesed valikud, suured avastused. <span>Tartu · 16–19</span></footer>
  </div>;
}
