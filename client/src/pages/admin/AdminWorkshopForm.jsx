import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../../lib/api';

const empty = {
  title: '',
  story: '',
  dateLabel: '',
  location: '',
  images: [],
  published: true,
  featured: false,
};

export default function AdminWorkshopForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api(`/api/workshops/id/${id}`)
      .then((w) =>
        setForm({
          title: w.title,
          story: w.story || '',
          dateLabel: w.dateLabel || '',
          location: w.location || '',
          images: w.images || [],
          published: w.published,
          featured: w.featured,
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
    setUploading(true);
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await api('/api/upload', { method: 'POST', body });
      update('images', [...form.images, res.url]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await api('/api/workshops', { method: 'POST', body: form });
      } else {
        await api(`/api/workshops/${id}`, { method: 'PUT', body: form });
      }
      navigate('/admin/workshops');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>{isNew ? 'Add workshop' : 'Edit workshop'}</h1>
        <Link to="/admin/workshops" className="text-link">
          Back
        </Link>
      </div>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Title
          <input value={form.title} onChange={(e) => update('title', e.target.value)} required />
        </label>
        <div className="form-row">
          <label>
            Date label
            <input
              value={form.dateLabel}
              onChange={(e) => update('dateLabel', e.target.value)}
              placeholder="e.g. March 2026"
            />
          </label>
          <label>
            Location
            <input
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="e.g. Studio, Mumbai"
            />
          </label>
        </div>
        <label>
          Story
          <textarea
            rows={8}
            value={form.story}
            onChange={(e) => update('story', e.target.value)}
            placeholder="Write about this workshop…"
          />
        </label>
        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
            />
            Featured on homepage
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update('published', e.target.checked)}
            />
            Published
          </label>
        </div>
        <div>
          <p className="label-text">Photos</p>
          <div className="image-preview-row">
            {form.images.map((img) => (
              <div key={img} className="image-preview">
                <img src={mediaUrl(img)} alt="" />
                <button
                  type="button"
                  onClick={() => update('images', form.images.filter((i) => i !== img))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <label className="file-label">
            {uploading ? 'Uploading…' : 'Upload photo'}
            <input type="file" accept="image/*" onChange={onUpload} hidden disabled={uploading} />
          </label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save workshop'}
        </button>
      </form>
    </div>
  );
}
