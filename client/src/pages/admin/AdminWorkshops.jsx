import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, mediaUrl } from '../../lib/api';

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);

  async function load() {
    setWorkshops(await api('/api/workshops?admin=1'));
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function remove(id) {
    if (!confirm('Delete this workshop?')) return;
    await api(`/api/workshops/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Workshops</h1>
        <Link to="/admin/workshops/new" className="btn btn-primary">
          Add workshop
        </Link>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Workshop</th>
              <th>Date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {workshops.map((w) => (
              <tr key={w._id}>
                <td>
                  <div className="admin-product-cell">
                    {w.images?.[0] ? (
                      <img src={mediaUrl(w.images[0])} alt="" />
                    ) : (
                      <span className="product-placeholder sm" />
                    )}
                    <span>{w.title}</span>
                  </div>
                </td>
                <td>{w.dateLabel || '—'}</td>
                <td>
                  {w.published ? 'Published' : 'Draft'}
                  {w.featured ? ' · Featured' : ''}
                </td>
                <td className="admin-actions">
                  <Link to={`/admin/workshops/${w._id}`}>Edit</Link>
                  <button type="button" onClick={() => remove(w._id)}>
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
