import { useCallback, useEffect, useState } from 'react';

import Button from './Button';
import Input from './Input';
import api from '../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
      setError(null);
    } catch {
      setError('Categorieën konden niet worden geladen.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await api.post('/api/categories', { name: newName.trim() });
      setNewName('');
      await fetchCategories();
    } catch {
      setError('Aanmaken mislukt.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      await fetchCategories();
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

export default CategoryManagement;
