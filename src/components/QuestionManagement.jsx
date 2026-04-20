import { useEffect, useState } from 'react';

import Button from './Button';
import Input from './Input';
import api from '../services/api';

const ANSWER_KEYS = ['A', 'B', 'C', 'D'];

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subcategoryId, setSubcategoryId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState({ A: '', B: '', C: '', D: '' });
  const [correctKey, setCorrectKey] = useState('A');
  const [submitting, setSubmitting] = useState(false);

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
  }, []);

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!subcategoryId || !questionText.trim()) return;
    setSubmitting(true);
    try {
      const questionResponse = await api.post('/api/questions', {
        subcategoryId: Number(subcategoryId),
        text: questionText.trim(),
      });
      const questionId = questionResponse.data.id;

      for (const key of ANSWER_KEYS) {
        await api.post(`/api/questions/${questionId}/answers`, {
          text: answers[key].trim(),
          correct: key === correctKey,
        });
      }

      setSubcategoryId('');
      setQuestionText('');
      setAnswers({ A: '', B: '', C: '', D: '' });
      setCorrectKey('A');
      setQuestions((prev) => [...prev, questionResponse.data]);
    } catch {
      setError('Vraag aanmaken mislukt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch {
      setError('Verwijderen mislukt.');
    }
  };

  return (
    <div className="admin-section">
      <form className="admin-form" onSubmit={handleCreate}>
        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="subcategory-id">
            Subcategorie ID
          </label>
          <input
            id="subcategory-id"
            className="admin-form__input"
            type="number"
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            placeholder="bijv. 3"
            required
            min={1}
          />
        </div>

        <Input
          id="question-text"
          label="Vraagtekst"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Stel je vraag..."
          required
        />

        <div className="admin-answers">
          {ANSWER_KEYS.map((key) => (
            <div key={key} className="admin-answer-row">
              <label className="admin-answer-row__radio">
                <input
                  type="radio"
                  name="correct-answer"
                  value={key}
                  checked={correctKey === key}
                  onChange={() => setCorrectKey(key)}
                />
                <span className="admin-answer-row__key">{key}</span>
              </label>
              <input
                className="admin-form__input"
                type="text"
                value={answers[key]}
                onChange={(e) => handleAnswerChange(key, e.target.value)}
                placeholder={`Antwoord ${key}`}
                required
              />
            </div>
          ))}
          <p className="admin-answers__hint">
            Selecteer het correcte antwoord via de radioknop.
          </p>
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Opslaan...' : 'Vraag toevoegen'}
        </Button>
      </form>

      {loading && <p className="admin-status">Laden...</p>}
      {error && <p className="admin-status admin-status--error">{error}</p>}

      {!loading && !error && (
        <ul className="admin-list">
          {questions.map((question) => (
            <li key={question.id} className="admin-list__item">
              <span className="admin-list__name">{question.text}</span>
              <div className="admin-list__actions">
                <Button onClick={() => handleDelete(question.id)}>
                  Verwijderen
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionManagement;
