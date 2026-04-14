import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

const TIMER_SECONDS = 10;

const useQuiz = ({ subcategoryId, gameMode, difficulty }) => {
  const navigate = useNavigate();

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

  const submitQuiz = useCallback(
    async (finalAnswers) => {
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
      } finally {
        setSubmitting(false);
      }
    },
    [subcategoryId, gameMode, difficulty, navigate],
  );

  const advance = useCallback(
    (overrideAnswerId) => {
      if (!currentQuestion) return;

      const resolvedAnswerId =
        overrideAnswerId !== undefined ? overrideAnswerId : selectedAnswerId;

      const updatedAnswers = [
        ...answers,
        { questionId: currentQuestion.id, answerId: resolvedAnswerId },
      ];

      const isLast = currentIndex === questions.length - 1;

      if (isLast) {
        clearInterval(timerRef.current);
        submitQuiz(updatedAnswers);
      } else {
        setAnswers(updatedAnswers);
        setCurrentIndex((i) => i + 1);
        setSelectedAnswerId(null);
        setRevealed(false);
        setTimeLeft(TIMER_SECONDS);
      }
    },
    [
      selectedAnswerId,
      answers,
      currentQuestion,
      currentIndex,
      questions.length,
      submitQuiz,
    ],
  );

  const selectAnswer = useCallback(
    (answerId) => {
      if (revealed) return;
      clearInterval(timerRef.current);
      setSelectedAnswerId(answerId);
      setRevealed(true);
    },
    [revealed],
  );

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

  return {
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
  };
};

export default useQuiz;
