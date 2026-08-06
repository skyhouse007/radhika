import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../lib/api';

export default function JournalPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/api/journal/${slug}`)
      .then(setPost)
      .catch((err) => setError(err.message));
  }, [slug]);

  if (error) {
    return (
      <section className="section page-top container">
        <p>{error}</p>
        <Link to="/journal">Back to journal</Link>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="section page-top container">
        <p className="muted">Loading…</p>
      </section>
    );
  }

  return (
    <article className="section page-top">
      <div className="container journal-article">
        <Link to="/journal" className="text-link">
          ← Journal
        </Link>
        <time>
          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1>{post.title}</h1>
        {post.coverImage && (
          <div className="article-cover">
            <img src={mediaUrl(post.coverImage)} alt="" />
          </div>
        )}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}
