import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '../components/Avatar';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
const DIFFICULTY_LABELS = { BEGINNER: 'Beginner', INTERMEDIATE: 'Gemiddeld', EXPERT: 'Expert' };

const ProfilePage = () => {
  const { displayName, avatarPath } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const avatarSrc = avatarPath ? `${API_BASE}${avatarPath}` : null;

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
        >
          Avatar wijzigen
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="profile-page__file-input"
        />
      </section>

      <form className="profile-page__form">
        <Input
          id="displayName"
          label="Weergavenaam"
          type="text"
          value={displayName ?? ''}
          onChange={() => {}}
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
                className="profile-page__difficulty-btn"
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </fieldset>

        <Button type="submit" fullWidth>
          Profiel opslaan
        </Button>
      </form>
    </div>
  );
};

export default ProfilePage;
