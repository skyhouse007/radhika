import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice, mediaUrl } from '../../lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  async function load() {
    const data = await api('/api/products?admin=1');
    setProducts(data);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function remove(id) {
    if (!confirm('Delete this product?')) return;
    await api(`/api/products/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Products</h1>
        <Link to="/admin/products/new" className="btn btn-primary">
          Add product
        </Link>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <div className="admin-product-cell">
                    {p.images?.[0] ? (
                      <img src={mediaUrl(p.images[0])} alt="" />
                    ) : (
                      <span className="product-placeholder sm" />
                    )}
                    <span>{p.name}</span>
                  </div>
                </td>
                <td>{p.category?.name || '—'}</td>
                <td>{formatPrice(p.price)}</td>
                <td>
                  {p.active ? 'Active' : 'Hidden'}
                  {p.featured ? ' · Featured' : ''}
                </td>
                <td className="admin-actions">
                  <Link to={`/admin/products/${p._id}`}>Edit</Link>
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
