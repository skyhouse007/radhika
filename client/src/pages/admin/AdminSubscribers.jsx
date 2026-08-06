import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    api('/api/newsletter').then(setSubscribers).catch(console.error);
  }, []);

  return (
    <div className="admin-page">
      <h1>Newsletter subscribers</h1>
      <p className="muted">{subscribers.length} emails stored</p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s._id}>
                <td>{s.email}</td>
                <td>{new Date(s.createdAt).toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
