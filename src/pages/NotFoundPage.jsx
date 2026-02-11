import { useNavigate } from 'react-router-dom';

import Button from '../components/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <p className="not-found-page__code">404</p>
      <p className="not-found-page__subtitle">Pagina niet gevonden</p>
      <Button onClick={() => navigate('/dashboard')}>Terug naar dashboard</Button>
    </div>
  );
};

export default NotFoundPage;
