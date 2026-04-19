import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './LoginPage.css';

const TAB_LOGIN = 'login';
const TAB_REGISTER = 'register';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(TAB_LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      login(data.token, data.role, data.userId, data.displayName);
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error ??
          'Inloggen mislukt. Controleer je gegevens.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/api/auth/register', {
        email,
        password,
        displayName,
      });
      login(data.token, data.role, data.userId, data.displayName);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error ??
          'Registreren mislukt. Probeer het opnieuw.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <video className="login-video" autoPlay muted loop playsInline>
        <source src="/brain-background-video.mov" type="video/mp4" />
      </video>

      <div className="login-layout">
        <div className="login-brand">
          <span className="login-icon" aria-hidden="true">
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#login-grad)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient
                  id="login-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#f9a8d4" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <path d="M9 6C7.5 4.5 5 5 4.5 7S6 11 8 11.5" />
              <path d="M15 6C16.5 4.5 19 5 19.5 7S18 11 16 11.5" />
              <path d="M8 11.5C6.5 12.5 6 14 7 15.5S9.5 16.5 11 16" />
              <path d="M16 11.5C17.5 12.5 18 14 17 15.5S14.5 16.5 13 16" />
              <line x1="12" y1="5.5" x2="12" y2="16" />
              <circle cx="12" cy="12" r="2.2" />
              <path d="M10 16H14" />
              <path d="M10.2 17.8C10.2 18.8 11 19.5 11 19.5H13C13 19.5 13.8 18.8 13.8 17.8" />
              <line x1="10.5" y1="20.5" x2="13.5" y2="20.5" />
              <line x1="11" y1="22" x2="13" y2="22" />
            </svg>
          </span>
          <h1>
            Test je kennis.
            <br />
            Verdien je plek.
          </h1>
          <p>Kies een onderwerp, speel een quiz en klim de ranglijst.</p>
        </div>

        <div className="login-card">
          <div className="login-toggle" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === TAB_LOGIN}
              className={`login-toggle-btn${activeTab === TAB_LOGIN ? ' login-toggle-btn--active' : ''}`}
              onClick={() => switchTab(TAB_LOGIN)}
            >
              Inloggen
            </button>
            <button
              role="tab"
              aria-selected={activeTab === TAB_REGISTER}
              className={`login-toggle-btn${activeTab === TAB_REGISTER ? ' login-toggle-btn--active' : ''}`}
              onClick={() => switchTab(TAB_REGISTER)}
            >
              Registreren
            </button>
          </div>

          {activeTab === TAB_LOGIN ? (
            <form className="login-form" onSubmit={handleLogin} noValidate>
              <Input
                id="login-email"
                label="E-mailadres"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@email.com"
                required
              />
              <Input
                id="login-password"
                label="Wachtwoord"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimaal 6 tekens"
                required
              />
              {error && <p className="login-error">{error}</p>}
              <Button
                type="submit"
                label="Inloggen"
                variant="white"
                fullWidth
                disabled={loading}
              />
            </form>
          ) : (
            <form className="login-form" onSubmit={handleRegister} noValidate>
              <Input
                id="register-display-name"
                label="Naam"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jouw weergavenaam"
                required
              />
              <Input
                id="register-email"
                label="E-mailadres"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@email.com"
                required
              />
              <Input
                id="register-password"
                label="Wachtwoord"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimaal 6 tekens"
                required
              />
              <Input
                id="register-confirm-password"
                label="Wachtwoord bevestigen"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Herhaal wachtwoord"
                required
              />
              {error && <p className="login-error">{error}</p>}
              <Button
                type="submit"
                label="Account aanmaken"
                variant="white"
                fullWidth
                disabled={loading}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
