import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mediaUrl } from '../lib/api';

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/workshops')
      .then(setWorkshops)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-intro">
          <h1>Workshops</h1>
          <p>Moments from painting sessions, studio days, and shared creativity.</p>
        </div>

        {loading ? (
          <p className="muted">Loading…</p>
        ) : workshops.length === 0 ? (
          <p className="muted">No workshops yet — check back soon.</p>
        ) : (
          <div className="workshop-grid">
            {workshops.map((w) => (
              <Link key={w._id} to={`/workshops/${w.slug}`} className="workshop-card">
                <div className="workshop-media">
                  {w.images?.[0] ? (
                    <img src={mediaUrl(w.images[0])} alt="" loading="lazy" />
                  ) : (
                    <div className="product-placeholder" aria-hidden />
                  )}
                </div>
                <div className="workshop-meta">
                  {(w.dateLabel || w.location) && (
                    <p className="workshop-meta-line">
                      {[w.dateLabel, w.location].filter(Boolean).join(' · ')}
                    </p>
                  )}
                  <h2>{w.title}</h2>
                  {w.story && <p>{w.story.slice(0, 140)}{w.story.length > 140 ? '…' : ''}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
