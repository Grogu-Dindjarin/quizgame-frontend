import { useEffect, useState } from 'react';

import Button from '../components/Button';
import Input from '../components/Input';
import api from '../services/api';
import './AdminPage.css';

const TABS = ['Categorieën', 'Vragen'];
const ANSWER_KEYS = ['A', 'B', 'C', 'D'];

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/categories');
        setCategories(response.data);
      } catch {
        setError('Categorieën konden niet worden geladen.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await api.post('/api/categories', { name: newName.trim() });
      setNewName('');
    } catch {
      setError('Aanmaken mislukt.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
    } catch {
      setError('Verwijderen mislukt.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    try {
      await api.put(`/api/categories/${editingId}`, { name: editName.trim() });
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name: editName.trim() } : c)),
      );
      setEditingId(null);
      setEditName('');
    } catch {
      setError('Bewerken mislukt.');
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  return (
    <div className="admin-tab-content">
      <form className="admin-form" onSubmit={handleCreate}>
        <Input
          id="new-category"
          label="Nieuwe categorie"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Naam categorie"
          required
        />
        <Button type="submit" disabled={creating}>
          {creating ? 'Aanmaken...' : 'Aanmaken'}
        </Button>
      </form>

      {loading && <p className="admin-status">Laden...</p>}
      {error && <p className="admin-status admin-status--error">{error}</p>}

      {!loading && !error && (
        <ul className="admin-list">
          {categories.map((category) => (
            <li key={category.id} className="admin-list__item">
              <span className="admin-list__name">{category.name}</span>
              <div className="admin-list__actions">
                <Button onClick={() => startEdit(category)}>Bewerken</Button>
                <Button onClick={() => handleDelete(category.id)}>Verwijderen</Button>
              </div>
              {editingId === category.id && (
                <form className="admin-inline-form" onSubmit={handleEditSubmit}>
                  <Input
                    id={`edit-category-${category.id}`}
                    label="Naam wijzigen"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <div className="admin-inline-form__actions">
                    <Button type="submit">Opslaan</Button>
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setEditName('');
                      }}
                    >
                      Annuleren
                    </Button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const QuestionsTab = () => {
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
    <div className="admin-tab-content">
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
          <p className="admin-answers__hint">Selecteer het correcte antwoord via de radioknop.</p>
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
                <Button onClick={() => handleDelete(question.id)}>Verwijderen</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin</h1>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab${activeTab === tab ? ' admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Categorieën' && <CategoriesTab />}
      {activeTab === 'Vragen' && <QuestionsTab />}
    </div>
  );
};

export default AdminPage;
