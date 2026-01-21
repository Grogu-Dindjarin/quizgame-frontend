import './AnswerOption.css';

const AnswerOption = ({ text, label, selected, correct, revealed, onClick }) => {
  const getModifier = () => {
    if (!revealed) return selected ? 'selected' : '';
    if (correct) return 'correct';
    if (selected && !correct) return 'wrong';
    return '';
  };

  const modifier = getModifier();

  return (
    <button
      type="button"
      className={`answer-option${modifier ? ` answer-option--${modifier}` : ''}`}
      onClick={onClick}
      disabled={revealed}
    >
      <span className="answer-option__label">{label}</span>
      <span className="answer-option__text">{text}</span>
    </button>
  );
};

export default AnswerOption;
