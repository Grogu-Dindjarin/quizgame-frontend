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
      {displayName?.split(' ').map(w => w.charAt(0)).join('').toUpperCase().slice(0, 2)}
    </div>
  );
};

export default Avatar;
