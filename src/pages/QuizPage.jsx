import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AnswerOption from '../components/AnswerOption';
import QuizCard from '../components/QuizCard';
import api from '../services/api';
import './QuizPage.css';

const ANSWER_LABELS = ['A', 'B', 'C', 'D'];
const TIMER_SECONDS = 10;

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subcategoryId, gameMode, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  const currentQuestion = questions[currentIndex] || null;

  const advance = useCallback(
    (overrideAnswerId) => {
      const resolvedAnswerId =
        overrideAnswerId !== undefined ? overrideAnswerId : selectedAnswerId;

      // BUG: no null guard — if user triggers advance before answers load,
      // resolvedAnswerId can be null and gets pushed into the answers array
      const updatedAnswers = [
        ...answers,
        { questionId: currentQuestion.id, answerId: resolvedAnswerId },
      ];

      const isLast = currentIndex === questions.length - 1;

      if (isLast) {
        submitQuiz(updatedAnswers);
      } else {
        setAnswers(updatedAnswers);
        setCurrentIndex((i) => i + 1);
        setSelectedAnswerId(null);
        setRevealed(false);
        setTimeLeft(TIMER_SECONDS);
      }
    },
    [selectedAnswerId, answers, currentQuestion, currentIndex, questions.length],
  );

  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const response = await api.post('/api/quiz-attempts', {
        subcategoryId,
        gameMode,
        difficulty,
        answers: finalAnswers,
      });
      navigate('/results', { state: response.data });
    } catch {
      setError('Quiz kon niet worden opgeslagen. Probeer opnieuw.');
      setSubmitting(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (loading || revealed || submitting) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setRevealed(true);
          setTimeout(() => advance(null), 1200);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, loading, revealed, submitting, advance]);

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/api/questions');
        const all = response.data;
        const filtered = subcategoryId
          ? all.filter((q) => q.subcategoryId === subcategoryId)
          : all;
        setQuestions(filtered);
      } catch {
        setError('Vragen konden niet worden geladen.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subcategoryId]);

  const handleSelectAnswer = (answerId) => {
    if (revealed) return;
    clearInterval(timerRef.current);
    setSelectedAnswerId(answerId);
    setRevealed(true);
  };

  const handleNext = () => advance();

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
              onClick={() => handleSelectAnswer(answer.id)}
            />
          ))}
        </div>

        {revealed && (
          <button
            type="button"
            className="quiz-page__next-btn"
            onClick={handleNext}
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
