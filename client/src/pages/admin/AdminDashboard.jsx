import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, posts: 0, subscribers: 0 });

  useEffect(() => {
    Promise.all([
      api('/api/products?admin=1'),
      api('/api/categories'),
      api('/api/journal?admin=1'),
      api('/api/newsletter'),
    ])
      .then(([products, categories, posts, subscribers]) => {
        setStats({
          products: products.length,
          categories: categories.length,
          posts: posts.length,
          subscribers: subscribers.length,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <Link to="/admin/products" className="stat-card">
          <span>Products</span>
          <strong>{stats.products}</strong>
        </Link>
        <Link to="/admin/categories" className="stat-card">
          <span>Categories</span>
          <strong>{stats.categories}</strong>
        </Link>
        <Link to="/admin/journal" className="stat-card">
          <span>Journal posts</span>
          <strong>{stats.posts}</strong>
        </Link>
        <Link to="/admin/subscribers" className="stat-card">
          <span>Subscribers</span>
          <strong>{stats.subscribers}</strong>
        </Link>
      </div>
    </div>
  );
}
