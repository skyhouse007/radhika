import { useEffect, useState } from 'react';
import { api, mediaUrl } from '../../lib/api';

export default function AdminStory() {
  const [storyTitle, setStoryTitle] = useState('');
  const [storyBody, setStoryBody] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api('/api/settings')
      .then((data) => {
        setStoryTitle(data.storyTitle || '');
        setStoryBody(data.storyBody || '');
        setHeroImage(data.heroImage || '');
      })
      .catch(console.error);
  }, []);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus('');
    try {
      const body = new FormData();
      body.append('image', file);
      const res = await api('/api/upload', { method: 'POST', body });
      setHeroImage(res.url);
      setStatus('Cover uploaded — click Save to apply');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus('');
    try {
      await api('/api/settings', {
        method: 'PUT',
        body: { storyTitle, storyBody, heroImage },
      });
      setStatus('Saved');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <h1>Homepage</h1>
      <p className="muted">Hero cover and story section on the homepage.</p>
      <form className="admin-form" onSubmit={onSubmit}>
        <h2 className="admin-form-section">Hero cover</h2>
        <div>
          <p className="label-text">Cover image</p>
          <div className="image-preview-row">
            <div className="image-preview hero-cover-preview">
              {heroImage ? (
                <img src={mediaUrl(heroImage)} alt="Hero cover" />
              ) : (
                <div className="product-placeholder" aria-hidden />
              )}
              {heroImage && (
                <button type="button" onClick={() => setHeroImage('')}>
                  Remove
                </button>
              )}
            </div>
          </div>
          <label className="file-label">
            {uploading ? 'Uploading…' : 'Upload cover'}
            <input type="file" accept="image/*" onChange={onUpload} hidden disabled={uploading} />
          </label>
        </div>

        <h2 className="admin-form-section">My story</h2>
        <label>
          Headline
          <input
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Story
          <textarea
            rows={8}
            value={storyBody}
            onChange={(e) => setStoryBody(e.target.value)}
            required
          />
        </label>
        {status && <p className="form-status">{status}</p>}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save homepage'}
        </button>
      </form>
    </div>
  );
}
