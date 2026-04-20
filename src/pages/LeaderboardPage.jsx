import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LeaderboardPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AvatarCircle = ({ displayName, avatarPath, size = 36 }) => {
  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (avatarPath) {
    return (
      <img
        className="lb-avatar"
        src={`${API_BASE}${avatarPath}`}
        alt={displayName}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="lb-avatar lb-avatar--initials"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
};

const LeaderboardPage = () => {
  const { userId } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/api/leaderboard');
        setEntries(response.data);
      } catch {
        setError(
          'Leaderboard kon niet worden geladen. Probeer het later opnieuw.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  const podiumOrder =
    top3.length >= 2 ? [top3[1], top3[0], top3[2]].filter(Boolean) : top3;

  return (
    <div className="leaderboard-page">
      <div className="lb-scroll">
        <div className="lb-hero">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#lb-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="lb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <path d="M8 4H16V11C16 14.5 14 16.5 12 17.5C10 16.5 8 14.5 8 11V4" />
            <line x1="8" y1="4" x2="16" y2="4" />
            <path d="M5 5H8" />
            <path d="M16 5H19" />
            <path d="M5 5C5 8.5 6.5 10.5 8 12" />
            <path d="M19 5C19 8.5 17.5 10.5 16 12" />
            <line x1="12" y1="17.5" x2="12" y2="20" />
            <line x1="8" y1="20" x2="16" y2="20" />
            <rect x="7" y="20" width="10" height="2" rx="1" />
          </svg>
          <h1 className="lb-title">Ranglijst</h1>
        </div>

        {loading && (
          <div className="lb-state">
            <p className="lb-state__text">Laden...</p>
          </div>
        )}

        {error && (
          <div className="lb-state lb-state--error">
            <p className="lb-state__text">{error}</p>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="lb-state lb-state--empty">
            <p className="lb-state__icon">🏆</p>
            <p className="lb-state__text">Nog geen scores beschikbaar</p>
            <p className="lb-state__hint">
              Speel een quiz om als eerste op het leaderboard te komen!
            </p>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            {top3.length >= 2 && (
              <div className="podium">
                {podiumOrder.map((entry) => {
                  const isFirst = entry.rank === 1;
                  const isThird = entry.rank === 3;
                  return (
                    <div
                      key={entry.userId}
                      className={`pod ${isFirst ? 'pod--1' : isThird ? 'pod--3' : 'pod--2'}`}
                    >
                      <AvatarCircle
                        displayName={entry.displayName}
                        avatarPath={entry.avatarPath}
                        size={isFirst ? 54 : 36}
                      />
                      <div className="pod__name">{entry.displayName}</div>
                      <div className="pod__score">
                        {entry.totalScore.toLocaleString('nl-NL')} pt
                      </div>
                      <div className="pod__step">
                        <span className="pod__rank">{entry.rank}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <ul className="rank-list">
              {(top3.length < 2 ? entries : rest).map((entry) => {
                const isMe = String(entry.userId) === String(userId);
                return (
                  <li
                    key={entry.userId}
                    className={`rank-row${isMe ? ' rank-row--mine' : ''}`}
                  >
                    <span className={`rank-num${isMe ? ' rank-num--me' : ''}`}>
                      {entry.rank}
                    </span>
                    <AvatarCircle
                      displayName={entry.displayName}
                      avatarPath={entry.avatarPath}
                    />
                    <div className="rank-info">
                      <div className="rank-name">
                        {entry.displayName}
                        {isMe && <span className="rank-you"> (jij)</span>}
                      </div>
                      <div className="rank-detail">
                        {entry.quizCount} quiz
                        {entry.quizCount !== 1 ? 'zes' : ''}
                      </div>
                    </div>
                    <div
                      className={`rank-score${isMe ? ' rank-score--me' : ''}`}
                    >
                      {entry.totalScore.toLocaleString('nl-NL')}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
