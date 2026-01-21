import './Badge.css';

const Badge = ({ name, description, iconPath }) => {
  const iconSrc = iconPath
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${iconPath}`
    : null;

  return (
    <div className="badge-card">
      <div className="badge-card__icon">
        {iconSrc ? (
          <img src={iconSrc} alt={name} className="badge-card__icon-img" />
        ) : (
          <span className="badge-card__icon-fallback">🏅</span>
        )}
      </div>
      <div className="badge-card__info">
        <span className="badge-card__name">{name}</span>
        <span className="badge-card__description">{description}</span>
      </div>
    </div>
  );
};

export default Badge;
