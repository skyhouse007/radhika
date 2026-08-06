import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminJournal() {
  const [posts, setPosts] = useState([]);

  async function load() {
    setPosts(await api('/api/journal?admin=1'));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function remove(id) {
    if (!confirm('Delete this post?')) return;
    await api(`/api/journal/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Journal</h1>
        <Link to="/admin/journal/new" className="btn btn-primary">
          New post
        </Link>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{new Date(p.publishedAt).toLocaleDateString('en-IN')}</td>
                <td>{p.published ? 'Published' : 'Draft'}</td>
                <td className="admin-actions">
                  <Link to={`/admin/journal/${p._id}`}>Edit</Link>
                  <button type="button" onClick={() => remove(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
