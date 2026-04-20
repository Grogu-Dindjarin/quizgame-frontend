import './AnswerOption.css';

const AnswerOption = ({
  text,
  label,
  selected,
  correct,
  revealed,
  onClick,
}) => {
  const getModifier = () => {
    if (!revealed) return selected ? 'selected' : '';
    if (correct) return 'correct';
    if (selected && !correct) return 'wrong';
    return '';
  };

  const modifier = getModifier();
  const labelClass = `answer-option__label answer-option__label--${label.toLowerCase()}`;

  return (
    <button
      type="button"
      className={`answer-option${modifier ? ` answer-option--${modifier}` : ''}`}
      onClick={onClick}
      disabled={revealed}
    >
      <span className={labelClass}>{label}</span>
      <span className="answer-option__text">{text}</span>
    </button>
  );
};

export default AnswerOption;
