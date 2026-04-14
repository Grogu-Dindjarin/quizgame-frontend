import './Avatar.css';

const Avatar = ({ src, displayName, size = 64 }) => {
  const style = { '--avatar-size': `${size}px` };

  if (src) {
    return (
      <img
        className="avatar"
        src={src}
        alt={`Avatar van ${displayName}`}
        style={style}
      />
    );
  }

  return (
    <div
      className="avatar avatar--placeholder"
      style={style}
      aria-label={`Avatar van ${displayName}`}
    >
      {displayName?.charAt(0).toUpperCase()}
    </div>
  );
};

export default Avatar;
