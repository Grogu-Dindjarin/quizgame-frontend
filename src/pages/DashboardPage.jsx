import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './DashboardPage.css';

const MODES = [
  {
    key: 'ONDERWERP',
    label: 'Thema',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10H7.5V7.5C7.5 6.7 8.2 6 9 6S10.5 6.7 10.5 7.5V10H14.5V14C15.3 14 16 14.7 16 15.5S15.3 17 14.5 17V20.5H10.5V18C10.5 17.2 9.8 16.5 9 16.5S7.5 17.2 7.5 18V20.5H4V17C3.2 17 2.5 16.3 2.5 15.5S3.2 14 4 14V10Z" />
      </svg>
    ),
  },
  {
    key: 'WILLEKEURIG',
    label: 'Willekeurig',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="3.5" />
        <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="7.5" cy="16.5" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="16.5" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'STREAK',
    label: 'Streak',
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="14,2 7,13 12.5,13 10,22 17,11 11.5,11" />
      </svg>
    ),
  },
];

const DIFFICULTIES = [
  { key: 'BEGINNER', label: 'Beginner', color: 'green' },
  { key: 'INTERMEDIATE', label: 'Gemiddeld', color: 'warn' },
  { key: 'EXPERT', label: 'Expert', color: 'danger' },
];

const CategoryAccordion = ({
  categories,
  selectedSubcategoryId,
  onSelectSubcategory,
}) => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="cat-list">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`cat-row${openId === cat.id ? ' cat-row--open' : ''}`}
        >
          <button
            type="button"
            className="cat-hd"
            onClick={() => toggle(cat.id)}
            aria-expanded={openId === cat.id}
          >
            <span>{cat.name}</span>
            <span className="cat-arrow">&#9660;</span>
          </button>
          {openId === cat.id && (
            <div className="cat-subs">
              {cat.subcategories?.length > 0 ? (
                cat.subcategories.map((sub) => {
                  const diff = DIFFICULTIES.find(
                    (d) => d.key === sub.difficulty,
                  );
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`sub-item${selectedSubcategoryId === sub.id ? ' sub-item--selected' : ''}`}
                      onClick={() => onSelectSubcategory(sub.id)}
                    >
                      <span>{sub.name}</span>
                      <span
                        className={`diff-pill diff-pill--${diff?.color ?? 'green'}`}
                      >
                        {diff?.label ?? sub.difficulty}
                      </span>
                    </button>
                  );
                })
              ) : (
                <span className="sub-item sub-item--empty">
                  Geen onderwerpen beschikbaar
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const { displayName, avatarPath, role, userId } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [totalScore, setTotalScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameMode, setGameMode] = useState('ONDERWERP');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, lbRes] = await Promise.all([
          api.get('/api/categories'),
          api.get('/api/leaderboard'),
        ]);
        setCategories(catsRes.data ?? []);
        const me = lbRes.data.find((e) => String(e.userId) === String(userId));
        if (me) setTotalScore(me.totalScore);
      } catch {
        setError('Categorieën konden niet worden geladen.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const canStart =
    gameMode === 'ONDERWERP' ? selectedSubcategoryId !== null : true;

  const handleStart = () => {
    navigate('/quiz', {
      state: { subcategoryId: selectedSubcategoryId, gameMode, difficulty },
    });
  };

  const avatarSrc = avatarPath
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${avatarPath}`
    : null;

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__user-info">
          <div className="dashboard__avatar">
            {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : initials}
          </div>
          <div className="dashboard__greeting">
            <span className="dashboard__greeting-sub">Welkom terug</span>
            <span className="dashboard__greeting-name">
              {displayName || 'Speler'}
            </span>
          </div>
        </div>
        {role === 'ADMIN' && (
          <button
            type="button"
            className="dashboard__admin-btn"
            onClick={() => navigate('/admin')}
          >
            Beheer
          </button>
        )}
      </header>

      {totalScore !== null && (
        <div className="dashboard__hero-stat">
          <div className="dashboard__hero-label">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6C7.5 4.5 5 5 4.5 7S6 11 8 11.5" />
              <path d="M15 6C16.5 4.5 19 5 19.5 7S18 11 16 11.5" />
              <path d="M8 11.5C6.5 12.5 6 14 7 15.5S9.5 16.5 11 16" />
              <path d="M16 11.5C17.5 12.5 18 14 17 15.5S14.5 16.5 13 16" />
              <circle cx="12" cy="12" r="2.2" />
            </svg>
            Totale score
          </div>
          <div className="dashboard__hero-value">
            {totalScore.toLocaleString('nl-NL')}
            <span>pt</span>
          </div>
        </div>
      )}

      <div className="dashboard__body">
        <section className="dashboard__section">
          <div className="dashboard__s-label">Spelmodus</div>
          <div className="mode-row">
            {MODES.map(({ key, label, icon }) => (
              <button
                key={key}
                type="button"
                className={`mode-card${gameMode === key ? ' mode-card--active' : ''}`}
                onClick={() => setGameMode(key)}
              >
                <span className="mode-card__icon">{icon}</span>
                <span className="mode-card__label">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard__section">
          <div className="dashboard__s-label">Moeilijkheidsgraad</div>
          <div className="diff-row">
            {DIFFICULTIES.map(({ key, label, color }) => (
              <button
                key={key}
                type="button"
                className={`diff-btn diff-btn--${color}${difficulty === key ? ' diff-btn--active' : ''}`}
                onClick={() => setDifficulty(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {gameMode === 'ONDERWERP' && (
          <section className="dashboard__section">
            <div className="dashboard__s-label">Kies onderwerp</div>
            {loading && <p className="dashboard__status">Laden...</p>}
            {error && (
              <p className="dashboard__status dashboard__status--error">
                {error}
              </p>
            )}
            {!loading && !error && categories.length === 0 && (
              <p className="dashboard__status">Geen categorieën beschikbaar</p>
            )}
            {!loading && !error && categories.length > 0 && (
              <CategoryAccordion
                categories={categories}
                selectedSubcategoryId={selectedSubcategoryId}
                onSelectSubcategory={setSelectedSubcategoryId}
              />
            )}
          </section>
        )}
      </div>

      <div className="dashboard__start-wrap">
        <button
          type="button"
          className="dashboard__start-btn"
          onClick={handleStart}
          disabled={!canStart}
        >
          Quiz starten
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
