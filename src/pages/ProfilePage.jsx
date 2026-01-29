import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './ProfilePage.css';

const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
const DIFFICULTY_LABELS = { BEGINNER: 'Beginner', INTERMEDIATE: 'Gemiddeld', EXPERT: 'Expert' };

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const ProfilePage = () => {
  const { displayName: ctxDisplayName, avatarPath, updateAvatar } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(ctxDisplayName ?? '');
  const [preferredDifficulty, setPreferredDifficulty] = useState('BEGINNER');
  const [avatarSrc, setAvatarSrc] = useState(
    avatarPath ? `${API_BASE}${avatarPath}` : null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    (async () => {
      try {
        const { data } = await api.get('/api/profile');
        setDisplayName(data.displayName ?? '');
        setPreferredDifficulty(data.preferredDifficulty ?? 'BEGINNER');
        setAvatarSrc(data.avatarPath ? `${API_BASE}${data.avatarPath}` : null);
      } catch {
        setError('Profiel kon niet worden geladen.');
      } finally {
        setLoading(false);
      }
    })();
  }

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
      setAvatarSrc(`${API_BASE}${data.avatarPath}`);
      // BUG: updateAvatar not called here — AuthContext/dashboard still shows old avatar
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

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-page__loading">Profiel laden…</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <button className="profile-page__back" type="button" onClick={() => navigate(-1)}>
          ← Terug
        </button>
        <h1 className="profile-page__title">Mijn profiel</h1>
      </header>

      <section className="profile-page__avatar-section">
        <Avatar src={avatarSrc} displayName={displayName} size={80} />
        <button
          className="profile-page__avatar-btn"
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingAvatar}
        >
          {uploadingAvatar ? 'Uploaden…' : 'Avatar wijzigen'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="profile-page__file-input"
          onChange={handleFileChange}
        />
      </section>

      {message && <p className="profile-page__message profile-page__message--success">{message}</p>}
      {error && <p className="profile-page__message profile-page__message--error">{error}</p>}

      <form className="profile-page__form" onSubmit={handleProfileSubmit}>
        <Input
          id="displayName"
          label="Weergavenaam"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Jouw naam"
          required
        />

        <fieldset className="profile-page__fieldset">
          <legend className="profile-page__legend">Voorkeursniveau</legend>
          <div className="profile-page__difficulty-group">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                className={`profile-page__difficulty-btn${preferredDifficulty === d ? ' profile-page__difficulty-btn--active' : ''}`}
                onClick={() => setPreferredDifficulty(d)}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </fieldset>

        <Button type="submit" fullWidth disabled={saving}>
          {saving ? 'Opslaan…' : 'Profiel opslaan'}
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
