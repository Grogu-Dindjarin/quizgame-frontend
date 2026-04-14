import { useLocation, useNavigate } from 'react-router-dom';

import Badge from '../components/Badge';
import './ResultsPage.css';

const getRating = (percentage) => {
  if (percentage >= 90) return '⭐⭐⭐';
  if (percentage >= 60) return '⭐⭐';
  return '⭐';
};

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    score = 0,
    totalQuestions = 0,
    earnedBadges = [],
  } = location.state || {};

  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const rating = getRating(percentage);

  return (
    <div className="results-page">
      <header className="results-page__header">
        <h1 className="results-page__title">Resultaat</h1>
        <p className="results-page__rating">{rating}</p>
      </header>

      <main className="results-page__main">
        <div className="results-page__stats">
          <div className="stat-card">
            <span className="stat-card__value">{score}</span>
            <span className="stat-card__label">Goed</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{totalQuestions}</span>
            <span className="stat-card__label">Totaal</span>
          </div>
          <div className="stat-card stat-card--highlight">
            <span className="stat-card__value">{percentage}%</span>
            <span className="stat-card__label">Score</span>
          </div>
        </div>

        {earnedBadges.length > 0 && (
          <section className="results-page__section">
            <h2 className="results-page__section-title">Behaalde badges</h2>
            <div className="results-page__badges">
              {earnedBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  iconPath={badge.iconPath}
                />
              ))}
            </div>
          </section>
        )}

        <section className="results-page__section">
          <h2 className="results-page__section-title">Samenvatting</h2>
          <p className="results-page__summary">
            Je hebt {score} van de {totalQuestions} vragen goed beantwoord.
          </p>
        </section>

        <div className="results-page__actions">
          <button
            type="button"
            className="results-page__btn results-page__btn--primary"
            onClick={() => navigate('/dashboard')}
          >
            Opnieuw spelen
          </button>
          <button
            type="button"
            className="results-page__btn results-page__btn--secondary"
            onClick={() => navigate('/leaderboard')}
          >
            Leaderboard
          </button>
          <button
            type="button"
            className="results-page__btn results-page__btn--ghost"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
