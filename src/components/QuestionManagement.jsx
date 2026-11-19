import { useEffect, useState } from 'react';

import Button from './Button';
import Input from './Input';
import api from '../services/api';

const ANSWER_KEYS = ['A', 'B', 'C', 'D'];
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const uploadImage = async (questionId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(
    `/api/questions/${questionId}/image`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
};

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subcategoryId, setSubcategoryId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState({ A: '', B: '', C: '', D: '' });
  const [correctKey, setCorrectKey] = useState('A');
  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
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

      const createdQuestion = imageFile
        ? await uploadImage(questionId, imageFile)
        : questionResponse.data;

      setSubcategoryId('');
      setQuestionText('');
      setAnswers({ A: '', B: '', C: '', D: '' });
      setCorrectKey('A');
      setImageFile(null);
      setFileInputKey((k) => k + 1);
      setQuestions((prev) => [...prev, createdQuestion]);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Vraag aanmaken mislukt.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = async (id, file) => {
    if (!file) return;
    setError(null);
    try {
      const updated = await uploadImage(id, file);
      setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch (err) {
      setError(err.response?.data?.error ?? 'Afbeelding uploaden mislukt.');
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

        <div className="admin-form__field">
          <label className="admin-form__label" htmlFor="question-image">
            Afbeelding (optioneel, max 1 MB)
          </label>
          <input
            key={fileInputKey}
            id="question-image"
            className="admin-form__file"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] ?? null)}
          />
        </div>

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
              {question.imagePath && (
                <img
                  className="admin-list__image"
                  src={`${API_BASE}${question.imagePath}`}
                  alt=""
                />
              )}
              <span className="admin-list__name">{question.text}</span>
              <div className="admin-list__actions">
                <label className="admin-list__upload">
                  {question.imagePath
                    ? 'Afbeelding wijzigen'
                    : 'Afbeelding toevoegen'}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      handleImageChange(question.id, e.target.files[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
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
