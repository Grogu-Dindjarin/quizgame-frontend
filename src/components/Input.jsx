import './Input.css';

const Input = ({ id, label, type = 'text', value, onChange, error, placeholder, required = false }) => (
  <div className={`input-group${error ? ' input-group--error' : ''}`}>
    {label && (
      <label htmlFor={id} className="input-label">
        {label}
        {required && <span className="input-required"> *</span>}
      </label>
    )}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="input-field"
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? 'true' : undefined}
    />
    {error && (
      <span id={`${id}-error`} className="input-error">
        {error}
      </span>
    )}
  </div>
);

export default Input;
