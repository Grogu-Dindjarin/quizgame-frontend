import { useLocation, useNavigate } from 'react-router-dom';

import AnswerOption from '../components/AnswerOption';
import QuizCard from '../components/QuizCard';
import useQuiz from '../hooks/useQuiz';
import './QuizPage.css';

const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subcategoryId, gameMode, difficulty } = location.state || {};

  const {
    questions,
    currentQuestion,
    currentIndex,
    selectedAnswerId,
    revealed,
    timeLeft,
    loading,
    submitting,
    error,
    advance,
    selectAnswer,
  } = useQuiz({ subcategoryId, gameMode, difficulty });

  const progressPercent =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="quiz-page quiz-page--centered">
        <p>Vragen laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page quiz-page--centered">
        <p className="quiz-page__error">{error}</p>
        <button type="button" onClick={() => navigate('/dashboard')}>
          Terug
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-page quiz-page--centered">
        <p>Geen vragen beschikbaar voor dit onderwerp.</p>
        <button type="button" onClick={() => navigate('/dashboard')}>
          Terug
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <header className="quiz-page__header">
        <div className="quiz-page__progress-bar">
          <div className="quiz-page__progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      <main className="quiz-page__main">
        <QuizCard
          questionText={currentQuestion.text}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="quiz-page__timer">
          <span
            className={`quiz-page__timer-value${timeLeft <= 3 ? ' quiz-page__timer-value--urgent' : ''}`}
          >
            {timeLeft}
          </span>
          <span className="quiz-page__timer-label">seconden</span>
        </div>

        <div className="quiz-page__answers">
          {currentQuestion.answers.map((answer, i) => (
            <AnswerOption
              key={answer.id}
              label={ANSWER_LABELS[i]}
              text={answer.text}
              selected={selectedAnswerId === answer.id}
              correct={answer.correct}
              revealed={revealed}
              onClick={() => selectAnswer(answer.id)}
            />
          ))}
        </div>

        {revealed && (
          <button
            type="button"
            className="quiz-page__next-btn"
            onClick={() => advance()}
            disabled={submitting}
          >
            {currentIndex === questions.length - 1 ? 'Resultaat bekijken' : 'Volgende'}
          </button>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
