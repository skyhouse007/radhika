import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const empty = { name: '', description: '', sortOrder: 0, image: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  async function load() {
    setCategories(await api('/api/categories'));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  function startEdit(cat) {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      sortOrder: cat.sortOrder || 0,
      image: cat.image || '',
    });
  }

  function reset() {
    setEditingId(null);
    setForm(empty);
    setError('');
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, sortOrder: Number(form.sortOrder) || 0 };
      if (editingId) {
        await api(`/api/categories/${editingId}`, { method: 'PUT', body: payload });
      } else {
        await api('/api/categories', { method: 'POST', body: payload });
      }
      reset();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this category?')) return;
    await api(`/api/categories/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Categories</h1>
      <div className="admin-split">
        <form className="admin-form" onSubmit={onSubmit}>
          <h2>{editingId ? 'Edit category' : 'Add category'}</h2>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Sort order
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button type="button" className="text-btn" onClick={reset}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Order</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.slug}</td>
                  <td>{c.sortOrder}</td>
                  <td className="admin-actions">
                    <button type="button" onClick={() => startEdit(c)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
