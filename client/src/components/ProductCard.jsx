import { Link } from 'react-router-dom';
import { formatPrice, mediaUrl } from '../lib/api';

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-media">
        {image ? (
          <img src={mediaUrl(image)} alt={product.name} loading="lazy" />
        ) : (
          <div className="product-placeholder" aria-hidden />
        )}
      </div>
      <div className="product-meta">
        <h3>{product.name}</h3>
        <p>{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
