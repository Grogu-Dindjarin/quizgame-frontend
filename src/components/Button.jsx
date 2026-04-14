import './Button.css';

const Button = ({
  label,
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={['btn', `btn--${variant}`, fullWidth ? 'btn--full' : '']
      .filter(Boolean)
      .join(' ')}
  >
    {children ?? label}
  </button>
);

export default Button;
