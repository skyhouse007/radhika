import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import NewsletterForm from '../components/NewsletterForm';
import { api, mediaUrl } from '../lib/api';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [posts, setPosts] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [story, setStory] = useState(null);
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    Promise.all([
      api('/api/products'),
      api('/api/journal'),
      api('/api/workshops?featured=true'),
      api('/api/settings'),
      api('/api/config'),
    ])
      .then(([products, journal, featuredWorkshops, settings, config]) => {
        setFeatured(products);
        setPosts(journal.slice(0, 2));
        setWorkshops(featuredWorkshops.slice(0, 3));
        setStory(settings);
        setInstagram(config.instagram || '');
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-visual" aria-hidden>
          <img
            src={
              story?.heroImage
                ? mediaUrl(story.heroImage)
                : '/images/hero-mountains.png'
            }
            alt=""
            className="hero-photo"
          />
        </div>
      </section>

      {story && (
        <section className="story-section">
          <div className="container story-inner">
            <h2 className="story-title">{story.storyTitle}</h2>
            <p className="story-body">{story.storyBody}</p>
            <div className="story-actions">
              <Link to="/about" className="btn btn-outline">
                Read more
              </Link>
              {instagram && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  Follow on IG
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {workshops.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Workshops</h2>
              <Link to="/workshops" className="text-link">
                View all
              </Link>
            </div>
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
                    <h3>{w.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Featured products</h2>
            <Link to="/shop" className="text-link">
              View all
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section newsletter-section">
        <div className="newsletter-artboard" aria-hidden>
          <img src="/images/hero-studio.png" alt="" />
        </div>
        <div className="container newsletter-block">
          <div className="newsletter-copy">
            <h2>Subscribe</h2>
            <p>Get updates on new drops and studio notes.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Articles</h2>
              <Link to="/journal" className="text-link">
                View all
              </Link>
            </div>
            <div className="journal-grid">
              {posts.map((post) => (
                <Link key={post._id} to={`/journal/${post.slug}`} className="journal-card">
                  <div className="journal-card-media">
                    {post.coverImage ? (
                      <img src={mediaUrl(post.coverImage)} alt="" loading="lazy" />
                    ) : (
                      <div className="product-placeholder" aria-hidden />
                    )}
                  </div>
                  <div className="journal-card-body">
                    <time>
                      {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
