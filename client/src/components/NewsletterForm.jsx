import { useState } from 'react';
import { api } from '../lib/api';

export default function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await api('/api/newsletter', { method: 'POST', body: { email } });
      setStatus(res.message || 'Subscribed!');
      setEmail('');
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={`newsletter-form ${compact ? 'compact' : ''}`} onSubmit={onSubmit}>
      <div className="newsletter-row">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Join'}
        </button>
      </div>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
