import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, mediaUrl } from '../lib/api';
import { renderArticleHtml } from '../lib/articleContent';

export default function JournalPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api(`/api/journal/${slug}`)
      .then(setPost)
      .catch((err) => setError(err.message));
  }, [slug]);

  const html = useMemo(() => {
    if (!post) return '';
    return renderArticleHtml(post.content, post.contentImages, mediaUrl);
  }, [post]);

  const fontStyle = useMemo(() => {
    if (!post?.fonts) return undefined;
    return {
      '--article-font-h1': `"${post.fonts.h1 || 'Libre Baskerville'}", Georgia, serif`,
      '--article-font-h2': `"${post.fonts.h2 || 'Libre Baskerville'}", Georgia, serif`,
      '--article-font-h3': `"${post.fonts.h3 || 'Assistant'}", sans-serif`,
      '--article-font-p': `"${post.fonts.p || 'Assistant'}", sans-serif`,
    };
  }, [post]);

  if (error) {
    return (
      <section className="section page-top container">
        <p>{error}</p>
        <Link to="/journal">Back to articles</Link>
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
          ← Articles
        </Link>
        <time>
          {new Date(post.publishedAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="article-page-title">{post.title}</h1>
        {post.coverImage && (
          <div className="article-cover">
            <img src={mediaUrl(post.coverImage)} alt="" />
          </div>
        )}
        <div
          className="article-body"
          style={fontStyle}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  );
}
