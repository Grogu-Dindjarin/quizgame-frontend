import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const GradDefs = ({ id }) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#ec4899" />
      <stop offset="100%" stopColor="#7c3aed" />
    </linearGradient>
  </defs>
);

const BrainIcon = ({ active }) => {
  const gid = 'ng-brain';
  const s = active ? `url(#${gid})` : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {active && <GradDefs id={gid} />}
      <g stroke={s}>
        <path d="M9 6C7.5 4.5 5 5 4.5 7S6 11 8 11.5" />
        <path d="M15 6C16.5 4.5 19 5 19.5 7S18 11 16 11.5" />
        <path d="M8 11.5C6.5 12.5 6 14 7 15.5S9.5 16.5 11 16" />
        <path d="M16 11.5C17.5 12.5 18 14 17 15.5S14.5 16.5 13 16" />
        <line x1="12" y1="5.5" x2="12" y2="16" />
        <circle cx="12" cy="12" r="2.2" />
        <path d="M10 16H14" />
        <path d="M10.2 17.5C10.2 18.5 11 19 11 19H13C13 19 13.8 18.5 13.8 17.5" />
        <line x1="10.5" y1="20" x2="13.5" y2="20" />
      </g>
    </svg>
  );
};

const TrophyIcon = ({ active }) => {
  const gid = 'ng-trophy';
  const s = active ? `url(#${gid})` : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {active && <GradDefs id={gid} />}
      <g stroke={s}>
        <path d="M8 4H16V11C16 14.5 14 16.5 12 17.5C10 16.5 8 14.5 8 11V4" />
        <line x1="8" y1="4" x2="16" y2="4" />
        <path d="M5 5H8" />
        <path d="M16 5H19" />
        <path d="M5 5C5 8.5 6.5 10.5 8 12" />
        <path d="M19 5C19 8.5 17.5 10.5 16 12" />
        <line x1="12" y1="17.5" x2="12" y2="20" />
        <line x1="8" y1="20" x2="16" y2="20" />
        <rect x="7" y="20" width="10" height="2" rx="1" />
      </g>
    </svg>
  );
};

const ProfileIcon = ({ active }) => {
  const gid = 'ng-profile';
  const s = active ? `url(#${gid})` : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {active && <GradDefs id={gid} />}
      <g stroke={s}>
        <path d="M3 18L6 8L10.5 14L12 5L13.5 14L18 8L21 18H3Z" />
        <line x1="3" y1="18" x2="21" y2="18" />
        <circle cx="6" cy="8" r="1.2" />
        <circle cx="12" cy="5" r="1.2" />
        <circle cx="18" cy="8" r="1.2" />
      </g>
    </svg>
  );
};

const AdminIcon = ({ active }) => {
  const gid = 'ng-admin';
  const s = active ? `url(#${gid})` : 'currentColor';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {active && <GradDefs id={gid} />}
      <g stroke={s}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </g>
    </svg>
  );
};

const NavBar = () => {
  const { role } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/dashboard" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
        {({ isActive }) => (
          <>
            <BrainIcon active={isActive} />
            <span className="navbar__label">Quiz</span>
          </>
        )}
      </NavLink>
      <NavLink to="/leaderboard" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
        {({ isActive }) => (
          <>
            <TrophyIcon active={isActive} />
            <span className="navbar__label">Ranglijst</span>
          </>
        )}
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
        {({ isActive }) => (
          <>
            <ProfileIcon active={isActive} />
            <span className="navbar__label">Profiel</span>
          </>
        )}
      </NavLink>
      {role === 'ADMIN' && (
        <NavLink to="/admin" className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
          {({ isActive }) => (
            <>
              <AdminIcon active={isActive} />
              <span className="navbar__label">Admin</span>
            </>
          )}
        </NavLink>
      )}
    </nav>
  );
};

export default NavBar;
