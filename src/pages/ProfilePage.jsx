import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

const DIFFICULTIES = [
  { key: 'BEGINNER', label: 'Beginner' },
  { key: 'INTERMEDIATE', label: 'Gemiddeld' },
  { key: 'EXPERT', label: 'Expert' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ProfilePage = () => {
  const { userId, logout, updateAvatar } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [preferredDifficulty, setPreferredDifficulty] = useState('BEGINNER');
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [profileRes, lbRes] = await Promise.all([
          api.get('/api/profile'),
          api.get('/api/leaderboard'),
        ]);

        if (!cancelled) {
          const p = profileRes.data;
          setDisplayName(p.displayName ?? '');
          setPreferredDifficulty(p.preferredDifficulty ?? 'BEGINNER');
          setAvatarSrc(p.avatarPath ? `${API_BASE}${p.avatarPath}` : null);

          const me = lbRes.data.find(
            (e) => String(e.userId) === String(userId),
          );
          if (me) {
            setStats({
              quizCount: me.quizCount,
              totalScore: me.totalScore,
              rank: me.rank,
            });
          }
        }
      } catch {
        if (!cancelled) setError('Profiel kon niet worden geladen.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingAvatar(true);
    setMessage(null);
    setError(null);

    try {
      const { data } = await api.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newSrc = `${API_BASE}${data.avatarPath}`;
      setAvatarSrc(newSrc);
      updateAvatar(data.avatarPath);
      setMessage('Avatar succesvol bijgewerkt.');
    } catch {
      setError('Avatar uploaden mislukt. Probeer het opnieuw.');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await api.put('/api/profile', { displayName, preferredDifficulty });
      setMessage('Profiel opgeslagen.');
    } catch {
      setError('Opslaan mislukt. Controleer je invoer.');
    } finally {
      setSaving(false);
    }
  };

  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile__loading">Profiel laden…</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile__scroll">
        <div className="prof-hero">
          <div className="prof-avatar">
            {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : initials}
          </div>
          <button
            type="button"
            className="prof-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? 'Uploaden…' : 'Foto wijzigen'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="prof-file-input"
            onChange={handleFileChange}
          />
          <div className="prof-name">{displayName || 'Speler'}</div>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-tile">
              <div className="stat-v">{stats.quizCount}</div>
              <div className="stat-l">Quizzes</div>
            </div>
            <div className="stat-tile">
              <div className="stat-v stat-v--score">
                {stats.totalScore.toLocaleString('nl-NL')}
              </div>
              <div className="stat-l">Score</div>
            </div>
            <div className="stat-tile">
              <div className="stat-v stat-v--rank">#{stats.rank}</div>
              <div className="stat-l">Rang</div>
            </div>
          </div>
        )}

        {(message || error) && (
          <div className="prof-sec">
            {message && <p className="prof-msg prof-msg--success">{message}</p>}
            {error && <p className="prof-msg prof-msg--error">{error}</p>}
          </div>
        )}

        <div className="prof-sec">
          <div className="prof-s-label">Profiel bewerken</div>
          <div className="prof-card">
            <form className="prof-form" onSubmit={handleProfileSubmit}>
              <div className="prof-field">
                <label className="prof-field-label" htmlFor="displayName">
                  Weergavenaam
                </label>
                <input
                  id="displayName"
                  type="text"
                  className="prof-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jouw naam"
                  required
                />
              </div>

              <div className="prof-field">
                <label className="prof-field-label">Voorkeursniveau</label>
                <div className="prof-diff-row">
                  {DIFFICULTIES.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      className={`prof-diff-btn${preferredDifficulty === key ? ' prof-diff-btn--active' : ''}`}
                      onClick={() => setPreferredDifficulty(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="prof-save-btn" disabled={saving}>
                {saving ? 'Opslaan…' : 'Profiel opslaan'}
              </button>
            </form>
          </div>
        </div>

        <div className="prof-sec">
          <button
            type="button"
            className="prof-logout-btn"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Uitloggen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
