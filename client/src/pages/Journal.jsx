import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mediaUrl } from '../lib/api';

export default function Journal() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/journal')
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-intro">
          <h1>Journal</h1>
          <p>Studio notes, collection stories, and the inspiration behind the work.</p>
        </div>

        {loading ? (
          <p className="muted">Loading…</p>
        ) : (
          <div className="journal-list">
            {posts.map((post) => (
              <article key={post._id} className="journal-row">
                <Link to={`/journal/${post.slug}`} className="journal-cover">
                  {post.coverImage ? (
                    <img src={mediaUrl(post.coverImage)} alt="" />
                  ) : (
                    <div className="product-placeholder" aria-hidden />
                  )}
                </Link>
                <div>
                  <time>
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2>
                    <Link to={`/journal/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
