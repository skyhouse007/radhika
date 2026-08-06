import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';

export default function Shop() {
  const { categorySlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/categories').then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const path = categorySlug
      ? `/api/products?category=${encodeURIComponent(categorySlug)}`
      : '/api/products';
    api(path)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categorySlug]);

  const active = categories.find((c) => c.slug === categorySlug);

  return (
    <section className="section page-top">
      <div className="container">
        <div className="page-intro">
          <h1>{active ? active.name : 'Shop'}</h1>
          <p>
            {active?.description ||
              'Postcards, greeting cards, and stationery made to live with you.'}
          </p>
        </div>

        <div className="filter-row">
          <Link to="/shop" className={!categorySlug ? 'active' : ''}>
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop/${cat.slug}`}
              className={categorySlug === cat.slug ? 'active' : ''}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {loading ? (
          <p className="muted">Loading…</p>
        ) : products.length === 0 ? (
          <p className="muted">No products in this collection yet.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
