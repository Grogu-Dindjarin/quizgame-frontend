import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
  const { role } = useAuth();

  return (
    <nav className="navbar">
      <NavLink
        to="/leaderboard"
        className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
      >
        <span className="navbar__icon">🏆</span>
        <span className="navbar__label">Leaderboard</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
      >
        <span className="navbar__icon">👤</span>
        <span className="navbar__label">Profiel</span>
      </NavLink>

      {role === 'ADMIN' && (
        <NavLink
          to="/admin"
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
        >
          <span className="navbar__icon">⚙️</span>
          <span className="navbar__label">Admin</span>
        </NavLink>
      )}
    </nav>
  );
};

export default NavBar;
