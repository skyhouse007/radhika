import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../../lib/api';
import { FONT_OPTIONS, findImgTags } from '../../lib/articleContent';

const empty = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  contentImages: {},
  fonts: {
    h1: 'Libre Baskerville',
    h2: 'Libre Baskerville',
    h3: 'Assistant',
    p: 'Assistant',
  },
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
};

function normalizeImages(raw) {
  if (!raw) return {};
  if (raw instanceof Map) return Object.fromEntries(raw);
  return { ...raw };
}

export default function AdminJournalForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState('');

  useEffect(() => {
    if (isNew) return;
    api(`/api/journal/id/${id}`)
      .then((p) =>
        setForm({
          title: p.title,
          excerpt: p.excerpt || '',
          content: p.content || '',
          coverImage: p.coverImage || '',
          contentImages: normalizeImages(p.contentImages),
          fonts: {
            h1: p.fonts?.h1 || 'Libre Baskerville',
            h2: p.fonts?.h2 || 'Libre Baskerville',
            h3: p.fonts?.h3 || 'Assistant',
            p: p.fonts?.p || 'Assistant',
          },
          published: p.published,
          publishedAt: new Date(p.publishedAt).toISOString().slice(0, 10),
        })
      )
      .catch((err) => setError(err.message));
  }, [id, isNew]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateFont(tag, value) {
    setForm((prev) => ({
      ...prev,
      fonts: { ...prev.fonts, [tag]: value },
    }));
  }

  function setContentImage(key, url) {
    setForm((prev) => ({
      ...prev,
      contentImages: { ...prev.contentImages, [key]: url },
    }));
  }

  const imgTags = useMemo(() => {
    const fromContent = findImgTags(form.content);
    const fromSaved = Object.keys(form.contentImages || {});
    return Array.from(new Set([...fromContent, ...fromSaved])).sort(
      (a, b) => Number(a.slice(3)) - Number(b.slice(3))
    );
  }, [form.content, form.contentImages]);

  async function uploadFor(key, file) {
    if (!file) return;
    setUploadingKey(key);
    setError('');
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await api('/api/upload', { method: 'POST', body });
      if (key === 'cover') update('coverImage', res.url);
      else setContentImage(key, res.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingKey('');
    }
  }

  function insertTag(tag) {
    update('content', `${form.content}${form.content ? '\n' : ''}${tag}`);
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
        <h1>{isNew ? 'New article' : 'Edit article'}</h1>
        <Link to="/admin/journal" className="text-link">
          Back
        </Link>
      </div>

      <form className="admin-form admin-form-wide" onSubmit={onSubmit}>
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

        <div className="article-guide">
          <p className="label-text">How to write content</p>
          <ul>
            <li>
              Headings: <code>&lt;h1&gt;…&lt;/h1&gt;</code> <code>&lt;h2&gt;…&lt;/h2&gt;</code>{' '}
              <code>&lt;h3&gt;…&lt;/h3&gt;</code>
            </li>
            <li>
              Paragraphs: <code>&lt;p&gt;Your text&lt;/p&gt;</code>
            </li>
            <li>
              Images: type <code>&lt;img1&gt;</code>, <code>&lt;img2&gt;</code>… then upload below
            </li>
            <li>
              Links: <code>&lt;link href=&quot;https://…&quot;&gt;Label&lt;/link&gt;</code> or{' '}
              <code>&lt;link&gt;https://…&lt;/link&gt;</code>
            </li>
          </ul>
          <div className="tag-insert-row">
            <button type="button" className="tag-chip" onClick={() => insertTag('<h1></h1>')}>
              + h1
            </button>
            <button type="button" className="tag-chip" onClick={() => insertTag('<h2></h2>')}>
              + h2
            </button>
            <button type="button" className="tag-chip" onClick={() => insertTag('<h3></h3>')}>
              + h3
            </button>
            <button type="button" className="tag-chip" onClick={() => insertTag('<p></p>')}>
              + p
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => {
                const next = (imgTags.length ? Number(imgTags[imgTags.length - 1].slice(3)) : 0) + 1;
                insertTag(`<img${next}>`);
              }}
            >
              + img
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => insertTag('<link href="">Label</link>')}
            >
              + link
            </button>
          </div>
        </div>

        <label>
          Content
          <textarea
            rows={14}
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
            placeholder={'<h1>My headline</h1>\n<p>A paragraph…</p>\n<img1>\n<p>More text</p>'}
          />
        </label>

        <h2 className="admin-form-section">Fonts for tags</h2>
        <div className="form-row form-row-4">
          {['h1', 'h2', 'h3', 'p'].map((tag) => (
            <label key={tag}>
              {`<${tag}>`}
              <select value={form.fonts[tag]} onChange={(e) => updateFont(tag, e.target.value)}>
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <h2 className="admin-form-section">Content images (&lt;img1&gt;, &lt;img2&gt;…)</h2>
        {imgTags.length === 0 ? (
          <p className="muted small">Add tags like &lt;img1&gt; in content to upload images here.</p>
        ) : (
          <div className="content-image-slots">
            {imgTags.map((key) => (
              <div key={key} className="content-image-slot">
                <p className="label-text">
                  &lt;{key}&gt;
                </p>
                {form.contentImages[key] ? (
                  <div className="image-preview">
                    <img src={mediaUrl(form.contentImages[key])} alt="" />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => {
                          const next = { ...prev.contentImages };
                          delete next[key];
                          return { ...prev, contentImages: next };
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <p className="muted small">No image yet</p>
                )}
                <label className="file-label">
                  {uploadingKey === key ? 'Uploading…' : `Upload ${key}`}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={Boolean(uploadingKey)}
                    onChange={(e) => {
                      uploadFor(key, e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
        )}

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
            {uploadingKey === 'cover' ? 'Uploading…' : 'Upload cover'}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={Boolean(uploadingKey)}
              onChange={(e) => {
                uploadFor('cover', e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </label>
        </div>

        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save article'}
        </button>
      </form>
    </div>
  );
}
