import './LoginPage.css';

const LoginPage = () => (
  <div className="login-page">
    <div className="login-card">
      <h1 className="login-title">Quizzle</h1>
      <div className="login-tabs">
        <button className="tab tab--active">Inloggen</button>
        <button className="tab">Registreren</button>
      </div>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">E-mailadres</label>
          <input id="email" type="email" placeholder="jouw@email.nl" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Wachtwoord</label>
          <input id="password" type="password" placeholder="Wachtwoord" />
        </div>
        <button type="submit" className="btn-primary">Inloggen</button>
      </form>
    </div>
  </div>
);

export default LoginPage;
