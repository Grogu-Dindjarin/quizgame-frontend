import { useCallback, useEffect, useState } from 'react';

import Button from './Button';
import api from '../services/api';

const ANSWER_KEYS = ['A', 'B', 'C', 'D'];
const MIN_ANSWERS = 2;
const MAX_ANSWERS = ANSWER_KEYS.length;

const AnswerManagement = ({ questionId }) => {
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const answersUrl = `/api/questions/${questionId}/answers`;

  const fetchAnswers = useCallback(async () => {
    const { data } = await api.get(answersUrl);
    setSavedAnswers(data);
    setRows(data.map((answer) => ({ ...answer, key: `answer-${answer.id}` })));
  }, [answersUrl]);

  useEffect(() => {
    const loadAnswers = async () => {
      try {
        await fetchAnswers();
      } catch {
        setError('Antwoorden konden niet worden geladen.');
      } finally {
        setLoading(false);
      }
    };

    loadAnswers();
  }, [fetchAnswers]);

  const updateRows = (update) => {
    setRows(update);
    setError(null);
    setMessage(null);
  };

  const handleTextChange = (key, text) => {
    updateRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, text } : row)),
    );
  };

  const handleCorrectChange = (key) => {
    updateRows((prev) =>
      prev.map((row) => ({ ...row, correct: row.key === key })),
    );
  };

  const handleAdd = () => {
    updateRows((prev) => [
      ...prev,
      {
        key: `new-${Date.now()}`,
        text: '',
        correct: !prev.some((row) => row.correct),
      },
    ]);
  };

  const handleRemove = (key) => {
    updateRows((prev) => prev.filter((row) => row.key !== key));
  };

  const saveRow = async ({ id, text, correct }) => {
    const body = { text: text.trim(), correct };
    if (!id) {
      await api.post(answersUrl, body);
      return;
    }
    const saved = savedAnswers.find((answer) => answer.id === id);
    if (saved.text !== body.text || saved.correct !== correct) {
      await api.put(`${answersUrl}/${id}`, body);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rows.some((row) => !row.text.trim())) {
      setError('Vul bij elk antwoord een tekst in.');
      return;
    }
    if (rows.filter((row) => row.correct).length !== 1) {
      setError('Selecteer één correct antwoord.');
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      // The correct answer is saved first, so the question always keeps one.
      const correctRow = rows.find((row) => row.correct);
      await saveRow(correctRow);
      for (const row of rows.filter((r) => r.key !== correctRow.key)) {
        await saveRow(row);
      }
      const removed = savedAnswers.filter(
        (answer) => !rows.some((row) => row.id === answer.id),
      );
      for (const answer of removed) {
        await api.delete(`${answersUrl}/${answer.id}`);
      }
      await fetchAnswers();
      setMessage('Antwoorden opgeslagen.');
    } catch (err) {
      setError(err.response?.data?.error ?? 'Antwoorden opslaan mislukt.');
      // Reload, because some of the changes may already have been saved.
      await fetchAnswers().catch(() => {});
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-status">Laden...</p>;

  return (
    <form className="admin-inline-form" onSubmit={handleSubmit}>
      <span className="admin-form__label">Antwoorden</span>
      <div className="admin-answers">
        {rows.map((row, index) => (
          <div key={row.key} className="admin-answer-row">
            <label className="admin-answer-row__radio">
              <input
                type="radio"
                name={`correct-answer-${questionId}`}
                checked={row.correct}
                onChange={() => handleCorrectChange(row.key)}
              />
              <span className="admin-answer-row__key">
                {ANSWER_KEYS[index] ?? index + 1}
              </span>
            </label>
            <input
              className="admin-form__input"
              type="text"
              aria-label={`Antwoord ${ANSWER_KEYS[index] ?? index + 1}`}
              value={row.text}
              onChange={(e) => handleTextChange(row.key, e.target.value)}
              maxLength={255}
              required
            />
            <div className="admin-list__actions">
              <Button
                onClick={() => handleRemove(row.key)}
                disabled={row.correct || rows.length <= MIN_ANSWERS}
              >
                Verwijderen
              </Button>
            </div>
          </div>
        ))}
        <p className="admin-answers__hint">
          Selecteer het correcte antwoord via de radioknop. Het correcte
          antwoord kan niet worden verwijderd.
        </p>
      </div>

      {error && <p className="admin-status admin-status--error">{error}</p>}
      {message && <p className="admin-status">{message}</p>}

      <div className="admin-inline-form__actions">
        <Button type="submit" disabled={saving}>
          {saving ? 'Opslaan...' : 'Antwoorden opslaan'}
        </Button>
        <Button onClick={handleAdd} disabled={rows.length >= MAX_ANSWERS}>
          Antwoord toevoegen
        </Button>
      </div>
    </form>
  );
};

export default AnswerManagement;
