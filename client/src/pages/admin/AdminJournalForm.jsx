import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../../lib/api';

const empty = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function AdminJournalForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api(`/api/journal/id/${id}`)
      .then((p) =>
        setForm({
          title: p.title,
          excerpt: p.excerpt || '',
          content: p.content || '',
          coverImage: p.coverImage || '',
          published: p.published,
          publishedAt: new Date(p.publishedAt).toISOString().slice(0, 10),
        })
      )
      .catch((err) => setError(err.message));
  }, [id, isNew]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await api('/api/upload', { method: 'POST', body });
      update('coverImage', res.url);
    } catch (err) {
      setError(err.message);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        publishedAt: new Date(form.publishedAt).toISOString(),
      };
      if (isNew) {
        await api('/api/journal', { method: 'POST', body: payload });
      } else {
        await api(`/api/journal/${id}`, { method: 'PUT', body: payload });
      }
      navigate('/admin/journal');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>{isNew ? 'New journal post' : 'Edit post'}</h1>
        <Link to="/admin/journal" className="text-link">
          Back
        </Link>
      </div>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Title
          <input value={form.title} onChange={(e) => update('title', e.target.value)} required />
        </label>
        <label>
          Excerpt
          <textarea
            rows={2}
            value={form.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
          />
        </label>
        <label>
          Content (HTML allowed)
          <textarea
            rows={10}
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
          />
        </label>
        <div className="form-row">
          <label>
            Publish date
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => update('publishedAt', e.target.value)}
            />
          </label>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update('published', e.target.checked)}
            />
            Published
          </label>
        </div>
        <div>
          <p className="label-text">Cover image</p>
          {form.coverImage && (
            <div className="image-preview">
              <img src={mediaUrl(form.coverImage)} alt="" />
              <button type="button" onClick={() => update('coverImage', '')}>
                Remove
              </button>
            </div>
          )}
          <label className="file-label">
            Upload cover
            <input type="file" accept="image/*" onChange={onUpload} hidden />
          </label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save post'}
        </button>
      </form>
    </div>
  );
}
