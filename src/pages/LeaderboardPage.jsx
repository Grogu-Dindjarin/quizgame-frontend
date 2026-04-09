import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../components/NavBar';
import LeaderboardRow from '../components/LeaderboardRow';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LeaderboardPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const LeaderboardPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/api/leaderboard');
        setEntries(response.data);
      } catch {
        setError('Leaderboard kon niet worden geladen. Probeer het later opnieuw.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-page__header">
        <button className="leaderboard-page__back" type="button" onClick={() => navigate(-1)}>
          ← Terug
        </button>
        <h1 className="leaderboard-page__title">Leaderboard</h1>
      </div>

      {loading && (
        <div className="leaderboard-page__state">
          <p className="leaderboard-page__state-text">Laden...</p>
        </div>
      )}

      {error && (
        <div className="leaderboard-page__state leaderboard-page__state--error">
          <p className="leaderboard-page__state-text">{error}</p>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="leaderboard-page__state leaderboard-page__state--empty">
          <p className="leaderboard-page__state-icon">🏆</p>
          <p className="leaderboard-page__state-text">Nog geen scores beschikbaar</p>
          <p className="leaderboard-page__state-hint">Speel een quiz om als eerste op het leaderboard te komen!</p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <ul className="leaderboard-page__list">
          {entries.map((entry) => (
            <li key={entry.userId}>
              <LeaderboardRow
                rank={entry.rank}
                displayName={entry.displayName}
                avatarPath={entry.avatarPath ? `${API_BASE}${entry.avatarPath}` : null}
                totalScore={entry.totalScore}
                quizCount={entry.quizCount}
                isCurrentUser={entry.userId === userId}
              />
            </li>
          ))}
        </ul>
      )}
      <NavBar />
    </div>
  );
};

export default LeaderboardPage;