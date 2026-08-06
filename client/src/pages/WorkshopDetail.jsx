import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../lib/api';

export default function WorkshopDetail() {
  const { slug } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    api(`/api/workshops/${slug}`)
      .then((data) => {
        setWorkshop(data);
        setActiveImage(0);
      })
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <section className="section page-top container">
        <p>{error}</p>
        <Link to="/workshops">Back to workshops</Link>
      </section>
    );
  }

  if (!workshop) {
    return (
      <section className="section page-top container">
        <p className="muted">Loading…</p>
      </section>
    );
  }

  const images = workshop.images?.length ? workshop.images : [''];

  return (
    <article className="section page-top">
      <div className="container workshop-detail">
        <Link to="/workshops" className="text-link">
          ← Workshops
        </Link>
        {(workshop.dateLabel || workshop.location) && (
          <p className="eyebrow">
            {[workshop.dateLabel, workshop.location].filter(Boolean).join(' · ')}
          </p>
        )}
        <h1>{workshop.title}</h1>

        <div className="workshop-gallery">
          <div className="workshop-main-image">
            {images[activeImage] ? (
              <img src={mediaUrl(images[activeImage])} alt={workshop.title} />
            ) : (
              <div className="product-placeholder tall" />
            )}
          </div>
          {images.length > 1 && (
            <div className="thumb-row">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  className={i === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(i)}
                >
                  {img ? (
                    <img src={mediaUrl(img)} alt="" />
                  ) : (
                    <span className="product-placeholder" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {workshop.story && (
          <div className="workshop-story">
            {workshop.story.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : null
            )}
          </div>
        )}
      </div>
    </article>
  );
}
