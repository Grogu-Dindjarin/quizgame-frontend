import { useEffect, useState } from 'react';

import AnswerManagement from './AnswerManagement';
import Button from './Button';
import Input from './Input';
import api from '../services/api';

const ANSWER_KEYS = ['A', 'B', 'C', 'D'];
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const subcategoryOptions = (subcategories) =>
  subcategories.map((subcategory) => (
    <option key={subcategory.id} value={subcategory.id}>
      {subcategory.categoryName} – {subcategory.name}
    </option>
  ));

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
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subcategoryId, setSubcategoryId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState({ A: '', B: '', C: '', D: '' });
  const [correctKey, setCorrectKey] = useState('A');
  const [imageFile, setImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editSubcategoryId, setEditSubcategoryId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionResponse, subcategoryResponse] = await Promise.all([
          api.get('/api/questions'),
          api.get('/api/subcategories'),
        ]);
        setQuestions(questionResponse.data);
        setSubcategories(subcategoryResponse.data);
      } catch {
        setError('Vragen konden niet worden geladen.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      setError(null);
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

  const startEdit = (question) => {
    setEditingId(question.id);
    setEditText(question.text);
    setEditSubcategoryId(String(question.subcategoryId));
  };

  const handleEditSubmit = async (e, question) => {
    e.preventDefault();
    if (!editText.trim() || !editSubcategoryId) return;
    try {
      const { data } = await api.put(`/api/questions/${question.id}`, {
        text: editText.trim(),
        subcategoryId: Number(editSubcategoryId),
        imagePath: question.imagePath,
      });
      setQuestions((prev) => prev.map((q) => (q.id === data.id ? data : q)));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Bewerken mislukt.');
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
            Subcategorie
          </label>
          <select
            id="subcategory-id"
            className="admin-form__input"
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            required
          >
            <option value="">Kies een subcategorie</option>
            {subcategoryOptions(subcategories)}
          </select>
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

        {error && <p className="admin-status admin-status--error">{error}</p>}
      </form>

      {loading && <p className="admin-status">Laden...</p>}

      {!loading && (
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
                <Button onClick={() => startEdit(question)}>Bewerken</Button>
                <Button onClick={() => handleDelete(question.id)}>
                  Verwijderen
                </Button>
              </div>
              {editingId === question.id && (
                <form
                  className="admin-inline-form"
                  onSubmit={(e) => handleEditSubmit(e, question)}
                >
                  <Input
                    id={`edit-question-${question.id}`}
                    label="Vraagtekst wijzigen"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    required
                  />
                  <div className="admin-form__field">
                    <label
                      className="admin-form__label"
                      htmlFor={`edit-question-subcategory-${question.id}`}
                    >
                      Subcategorie
                    </label>
                    <select
                      id={`edit-question-subcategory-${question.id}`}
                      className="admin-form__input"
                      value={editSubcategoryId}
                      onChange={(e) => setEditSubcategoryId(e.target.value)}
                      required
                    >
                      {subcategoryOptions(subcategories)}
                    </select>
                  </div>
                  <div className="admin-inline-form__actions">
                    <Button type="submit">Opslaan</Button>
                    <Button onClick={() => setEditingId(null)}>
                      Annuleren
                    </Button>
                  </div>
                </form>
              )}
              {editingId === question.id && (
                <AnswerManagement questionId={question.id} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionManagement;
