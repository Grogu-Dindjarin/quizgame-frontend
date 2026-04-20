import { useLocation, useNavigate } from 'react-router-dom';

import Badge from '../components/Badge';
import './ResultsPage.css';

const getLabel = (pct) => {
  if (pct >= 90) return 'Uitstekend!';
  if (pct >= 60) return 'Goed gedaan!';
  return 'Blijf oefenen!';
};

const ExplosionIcon = () => (
  <svg
    width="56"
    height="56"
    viewBox="0 0 24 24"
    fill="none"
    stroke="url(#res-grad)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="res-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f9a8d4" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <path d="M12 2L14.5 7.5L20.5 5L17.5 10.5L22 13.5L17 15L19.5 20.5L14 17.5L12 22L10 17.5L4.5 20.5L7 15L2 13.5L6.5 10.5L3.5 5L9.5 7.5Z" />
  </svg>
);

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

  return (
    <div className="results-page">
      <div className="results-scroll">
        <div className="res-hero">
          <ExplosionIcon />
          <div className="res-big">
            {score} / {totalQuestions}
          </div>
          <div className="res-label">{getLabel(percentage)}</div>
          <div className="res-sub">{percentage}% gescoord</div>
        </div>

        <div className="res-stats">
          <div className="res-stat-tile">
            <div className="res-stat-v res-stat-v--accent">{percentage}%</div>
            <div className="res-stat-l">Score</div>
          </div>
          <div className="res-stat-tile">
            <div className="res-stat-v">
              {score}/{totalQuestions}
            </div>
            <div className="res-stat-l">Correct</div>
          </div>
          <div className="res-stat-tile">
            <div className="res-stat-v res-stat-v--warn">+{score * 100}</div>
            <div className="res-stat-l">Punten</div>
          </div>
        </div>

        {earnedBadges.length > 0 && (
          <div className="res-sec">
            <div className="res-sec-label">Verdiende badges</div>
            <div className="res-badge-card">
              {earnedBadges.map((badge) => (
                <Badge
                  key={badge.id}
                  name={badge.name}
                  description={badge.description}
                  iconPath={badge.iconPath}
                />
              ))}
            </div>
          </div>
        )}

        <div className="res-btns">
          <button
            type="button"
            className="res-btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Opnieuw spelen
          </button>
          <button
            type="button"
            className="res-btn-outline"
            onClick={() => navigate('/leaderboard')}
          >
            Ranglijst bekijken
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
