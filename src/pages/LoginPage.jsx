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
      <div className="login-card">
        <h1 className="login-title">QuizGame</h1>

        <div className="login-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === TAB_LOGIN}
            className={`login-tab${activeTab === TAB_LOGIN ? ' login-tab--active' : ''}`}
            onClick={() => switchTab(TAB_LOGIN)}
          >
            Inloggen
          </button>
          <button
            role="tab"
            aria-selected={activeTab === TAB_REGISTER}
            className={`login-tab${activeTab === TAB_REGISTER ? ' login-tab--active' : ''}`}
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
              placeholder="jouw@email.nl"
              required
            />
            <Input
              id="login-password"
              label="Wachtwoord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="login-error">{error}</p>}
            <Button
              type="submit"
              label="Inloggen"
              fullWidth
              disabled={loading}
            />
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister} noValidate>
            <Input
              id="register-display-name"
              label="Weergavenaam"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Jouw naam"
              required
            />
            <Input
              id="register-email"
              label="E-mailadres"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jouw@email.nl"
              required
            />
            <Input
              id="register-password"
              label="Wachtwoord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Input
              id="register-confirm-password"
              label="Wachtwoord bevestigen"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="login-error">{error}</p>}
            <Button
              type="submit"
              label="Account aanmaken"
              fullWidth
              disabled={loading}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
