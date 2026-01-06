import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './DashboardPage.css';

const MODES = [
  { key: 'ONDERWERP', label: 'Onderwerp' },
  { key: 'WILLEKEURIG', label: 'Willekeurig' },
  { key: 'STREAK', label: 'Streak' },
];

const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

const DifficultyBadge = ({ difficulty }) => (
  <span className={`difficulty-badge difficulty-badge--${difficulty.toLowerCase()}`}>
    {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
  </span>
);

const CategoryAccordion = ({ categories, selectedSubcategoryId, onSelectSubcategory }) => {
  const [openCategoryId, setOpenCategoryId] = useState(null);

  const toggleCategory = (id) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="category-accordion">
      {categories.map((category) => (
        <div key={category.id} className="category-accordion__item">
          <button
            type="button"
            className="category-accordion__trigger"
            onClick={() => toggleCategory(category.id)}
            aria-expanded={openCategoryId === category.id}
          >
            <span>{category.name}</span>
            <span className="category-accordion__chevron">
              {openCategoryId === category.id ? '▲' : '▼'}
            </span>
          </button>

          {openCategoryId === category.id && (
            <ul className="category-accordion__subcategories">
              {category.subcategories && category.subcategories.length > 0 ? (
                category.subcategories.map((sub) => (
                  <li key={sub.id}>
                    <button
                      type="button"
                      className={`subcategory-option${selectedSubcategoryId === sub.id ? ' subcategory-option--selected' : ''}`}
                      onClick={() => onSelectSubcategory(sub.id)}
                    >
                      <span>{sub.name}</span>
                      <DifficultyBadge difficulty={sub.difficulty} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="subcategory-option subcategory-option--empty">
                  Geen onderwerpen beschikbaar
                </li>
              )}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

const DashboardPage = () => {
  const { displayName, avatarPath, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [gameMode, setGameMode] = useState('ONDERWERP');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch {
        setError('Categorieën konden niet worden geladen.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__user">
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="dashboard__avatar" />
          ) : (
            <div className="dashboard__avatar dashboard__avatar--placeholder">
              {displayName ? displayName.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <span className="dashboard__display-name">{displayName || 'Speler'}</span>
        </div>
        <button type="button" className="dashboard__logout" onClick={logout}>
          Uitloggen
        </button>
      </header>

      <main className="dashboard__main">
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Spelmodus</h2>
          <div className="mode-selector">
            {MODES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`mode-selector__btn${gameMode === key ? ' mode-selector__btn--active' : ''}`}
                onClick={() => setGameMode(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="dashboard__section">
          <h2 className="dashboard__section-title">Moeilijkheidsgraad</h2>
          <div className="mode-selector">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`mode-selector__btn mode-selector__btn--${d.toLowerCase()}${difficulty === d ? ' mode-selector__btn--active' : ''}`}
                onClick={() => setDifficulty(d)}
              >
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </section>

        {gameMode === 'ONDERWERP' && (
          <section className="dashboard__section">
            <h2 className="dashboard__section-title">Kies een onderwerp</h2>
            {loading && <p className="dashboard__status">Laden...</p>}
            {error && <p className="dashboard__status dashboard__status--error">{error}</p>}
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

        <button
          type="button"
          className="dashboard__start-btn"
          onClick={handleStart}
          disabled={!canStart}
        >
          Quiz starten
        </button>
      </main>

      <nav className="dashboard__bottom-nav">
        <a href="/leaderboard" className="bottom-nav__link">
          🏆 Leaderboard
        </a>
        <a href="/profile" className="bottom-nav__link">
          👤 Profiel
        </a>
      </nav>
    </div>
  );
};

export default DashboardPage;
