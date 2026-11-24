import { useCallback, useEffect, useState } from 'react';

import Button from './Button';
import Input from './Input';
import api from '../services/api';

const DIFFICULTIES = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Gemiddeld' },
  { value: 'EXPERT', label: 'Expert' },
];

const difficultyLabel = (value) =>
  DIFFICULTIES.find((d) => d.value === value)?.label ?? value;

const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('BEGINNER');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('BEGINNER');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [subResponse, catResponse] = await Promise.all([
        api.get('/api/subcategories'),
        api.get('/api/categories'),
      ]);
      setSubcategories(subResponse.data);
      setCategories(catResponse.data);
      setError(null);
    } catch {
      setError('Subcategorieën konden niet worden geladen.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newCategoryId) return;
    setCreating(true);
    try {
      await api.post('/api/subcategories', {
        name: newName.trim(),
        difficulty: newDifficulty,
        categoryId: Number(newCategoryId),
      });
      setNewName('');
      setNewDifficulty('BEGINNER');
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error ?? 'Aanmaken mislukt.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/subcategories/${id}`);
      setSubcategories((prev) => prev.filter((s) => s.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Verwijderen mislukt.');
    }
  };

  const startEdit = (subcategory) => {
    setEditingId(subcategory.id);
    setEditName(subcategory.name);
    setEditDifficulty(subcategory.difficulty);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    try {
      const { data } = await api.put(`/api/subcategories/${editingId}`, {
        name: editName.trim(),
        difficulty: editDifficulty,
      });
      setSubcategories((prev) =>
        prev.map((s) => (s.id === editingId ? data : s)),
      );
      cancelEdit();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error ?? 'Bewerken mislukt.');
    }
  };

  return (
    <div className="admin-section">
      <form className="admin-form" onSubmit={handleCreate}>
        <Input
          id="new-subcategory"
          label="Nieuwe subcategorie"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Naam subcategorie"
          required
        />

        <div className="admin-form__field">
          <label
            className="admin-form__label"
            htmlFor="new-subcategory-category"
          >
            Categorie
          </label>
          <select
            id="new-subcategory-category"
            className="admin-form__input"
            value={newCategoryId}
            onChange={(e) => setNewCategoryId(e.target.value)}
            required
          >
            <option value="">Kies een categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__field">
          <label
            className="admin-form__label"
            htmlFor="new-subcategory-difficulty"
          >
            Moeilijkheidsgraad
          </label>
          <select
            id="new-subcategory-difficulty"
            className="admin-form__input"
            value={newDifficulty}
            onChange={(e) => setNewDifficulty(e.target.value)}
          >
            {DIFFICULTIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={creating}>
          {creating ? 'Aanmaken...' : 'Aanmaken'}
        </Button>

        {error && <p className="admin-status admin-status--error">{error}</p>}
      </form>

      {loading && <p className="admin-status">Laden...</p>}

      {!loading && (
        <ul className="admin-list">
          {subcategories.map((subcategory) => (
            <li key={subcategory.id} className="admin-list__item">
              <span className="admin-list__name">{subcategory.name}</span>
              <span className="admin-list__meta">
                {subcategory.categoryName} ·{' '}
                {difficultyLabel(subcategory.difficulty)} ·{' '}
                {subcategory.questionCount} vragen
              </span>
              <div className="admin-list__actions">
                <Button onClick={() => startEdit(subcategory)}>Bewerken</Button>
                <Button onClick={() => handleDelete(subcategory.id)}>
                  Verwijderen
                </Button>
              </div>
              {editingId === subcategory.id && (
                <form className="admin-inline-form" onSubmit={handleEditSubmit}>
                  <Input
                    id={`edit-subcategory-${subcategory.id}`}
                    label="Naam wijzigen"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <div className="admin-form__field">
                    <label
                      className="admin-form__label"
                      htmlFor={`edit-subcategory-difficulty-${subcategory.id}`}
                    >
                      Moeilijkheidsgraad
                    </label>
                    <select
                      id={`edit-subcategory-difficulty-${subcategory.id}`}
                      className="admin-form__input"
                      value={editDifficulty}
                      onChange={(e) => setEditDifficulty(e.target.value)}
                    >
                      {DIFFICULTIES.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-inline-form__actions">
                    <Button type="submit">Opslaan</Button>
                    <Button onClick={cancelEdit}>Annuleren</Button>
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

export default SubcategoryManagement;
