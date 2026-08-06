import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../../lib/api';

const empty = {
  name: '',
  description: '',
  details: '',
  dimensions: '',
  material: '',
  price: '',
  category: '',
  stock: 0,
  featured: false,
  active: true,
  images: [],
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api('/api/categories').then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (isNew) return;
    api(`/api/products/id/${id}`)
      .then((p) =>
        setForm({
          name: p.name || '',
          description: p.description || '',
          details: p.details || '',
          dimensions: p.dimensions || '',
          material: p.material || '',
          price: p.price ?? '',
          category: p.category?._id || p.category || '',
          stock: p.stock || 0,
          featured: Boolean(p.featured),
          active: p.active !== false,
          images: p.images || [],
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
      setForm((prev) => ({ ...prev, images: [...prev.images, res.url] }));
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
      const payload = {
        name: form.name,
        description: form.description,
        details: form.details,
        dimensions: form.dimensions,
        material: form.material,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock) || 0,
        featured: form.featured,
        active: form.active,
        images: form.images,
      };
      if (isNew) {
        await api('/api/products', { method: 'POST', body: payload });
      } else {
        await api(`/api/products/${id}`, { method: 'PUT', body: payload });
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>{isNew ? 'Add product' : 'Edit product'}</h1>
        <Link to="/admin/products" className="text-link">
          Back
        </Link>
      </div>
      <p className="muted" style={{ marginBottom: '1.25rem' }}>
        Everything below appears on the product page and in the WhatsApp booking message.
      </p>
      <form className="admin-form" onSubmit={onSubmit}>
        <h2 className="admin-form-section">Basic info</h2>
        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </label>
        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-row">
          <label>
            Price (INR)
            <input
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              required
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => update('stock', e.target.value)}
            />
          </label>
        </div>

        <h2 className="admin-form-section">Product page details</h2>
        <label>
          Short description
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Shown under the price"
          />
        </label>
        <label>
          Details
          <textarea
            rows={4}
            value={form.details}
            onChange={(e) => update('details', e.target.value)}
            placeholder="Full details shown on the product page"
          />
        </label>
        <div className="form-row">
          <label>
            Dimensions
            <input
              value={form.dimensions}
              onChange={(e) => update('dimensions', e.target.value)}
              placeholder="e.g. 15 × 5 cm"
            />
          </label>
          <label>
            Material
            <input
              value={form.material}
              onChange={(e) => update('material', e.target.value)}
              placeholder="e.g. 300gsm cotton paper"
            />
          </label>
        </div>

        <h2 className="admin-form-section">Images & visibility</h2>
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
              checked={form.active}
              onChange={(e) => update('active', e.target.checked)}
            />
            Active (visible in shop)
          </label>
        </div>
        <div>
          <p className="label-text">Images</p>
          <div className="image-preview-row">
            {form.images.map((img) => (
              <div key={img} className="image-preview">
                <img src={mediaUrl(img)} alt="" />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter((i) => i !== img),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <label className="file-label">
            {uploading ? 'Uploading…' : 'Upload image'}
            <input type="file" accept="image/*" onChange={onUpload} hidden disabled={uploading} />
          </label>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save product'}
        </button>
      </form>
    </div>
  );
}
