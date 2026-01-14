import './QuizCard.css';

const QuizCard = ({ questionText, questionNumber, totalQuestions }) => (
  <div className="quiz-card">
    <span className="quiz-card__counter">
      Vraag {questionNumber} van {totalQuestions}
    </span>
    <p className="quiz-card__text">{questionText}</p>
  </div>
);

export default QuizCard;
