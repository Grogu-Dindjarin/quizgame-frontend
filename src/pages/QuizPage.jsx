import { useLocation, useNavigate } from 'react-router-dom';

import AnswerOption from '../components/AnswerOption';
import useQuiz from '../hooks/useQuiz';
import './QuizPage.css';

const ANSWER_LABELS = ['A', 'B', 'C', 'D'];

const HourglassIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="3" x2="19" y2="3" />
    <line x1="5" y1="21" x2="19" y2="21" />
    <path d="M5 3L19 3L12 12L19 21L5 21L12 12L5 3" />
    <path d="M8.5 6.5H15.5" />
    <path d="M9.5 17H14.5" />
  </svg>
);

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
      <div className="quiz-topbar">
        <div className="quiz-prog-track">
          <div
            className="quiz-prog-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="quiz-hd">
        <button
          type="button"
          className="quiz-back"
          onClick={() => navigate('/dashboard')}
        >
          ←
        </button>
        <span className="quiz-title">
          {currentQuestion.subcategoryName ?? 'Quiz'}
        </span>
        <span className="quiz-chip">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="quiz-scroll">
        <div className="quiz-content">
          <div className="quiz-cdown-card">
            <div>
              <div className="quiz-cdown-label">Resterende tijd</div>
              <div
                className={`quiz-cdown-num${timeLeft <= 3 ? ' quiz-cdown-num--urgent' : ''}`}
              >
                {timeLeft}
              </div>
            </div>
            <div className="quiz-cdown-right">
              <HourglassIcon />
            </div>
          </div>

          <div className="quiz-q-card">
            <p className="quiz-q-text">{currentQuestion.text}</p>
          </div>

          <div className="quiz-ans-list">
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
              className="quiz-next-btn"
              onClick={() => advance()}
              disabled={submitting}
            >
              {currentIndex === questions.length - 1
                ? 'Resultaat bekijken'
                : 'Volgende vraag →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
