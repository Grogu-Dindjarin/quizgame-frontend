import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import api from '../services/api';
import './QuizPage.css';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subcategoryId } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/api/questions');
        setQuestions(response.data);
      } catch {
        setError('Vragen konden niet worden geladen.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subcategoryId]);

  if (loading) return <div className="quiz-page quiz-page--centered"><p>Laden...</p></div>;
  if (error) return <div className="quiz-page quiz-page--centered"><p>{error}</p></div>;

  const currentQuestion = questions[currentIndex];

  if (!currentQuestion) {
    return (
      <div className="quiz-page quiz-page--centered">
        <p>Geen vragen beschikbaar.</p>
        <button type="button" onClick={() => navigate('/dashboard')}>Terug</button>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <main className="quiz-page__main">
        <p className="quiz-page__counter">{currentIndex + 1} / {questions.length}</p>
        <p className="quiz-page__question">{currentQuestion.text}</p>
        <div className="quiz-page__answers">
          {currentQuestion.answers && currentQuestion.answers.map((answer) => (
            <button
              key={answer.id}
              type="button"
              className="quiz-page__answer-btn"
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              {answer.text}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
