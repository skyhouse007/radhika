import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatPrice, mediaUrl } from '../lib/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    api(`/api/products/${slug}`)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
      })
      .catch((err) => setError(err.message));
  }, [slug]);

  useEffect(() => {
    api('/api/config')
      .then((cfg) => setWhatsapp(cfg.whatsapp || ''))
      .catch(() => {});
  }, []);

  if (error) {
    return (
      <section className="section page-top container">
        <p>{error}</p>
        <Link to="/shop">Back to paintings</Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section page-top container">
        <p className="muted">Loading…</p>
      </section>
    );
  }

  const images = product.images?.length ? product.images : [''];

  function buildWhatsAppUrl() {
    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const lines = [
      'Hi Radhika! I would like to book this product:',
      '',
      `Product: ${product.name}`,
      `Price: ${formatPrice(product.price)}`,
    ];

    if (product.category?.name) lines.push(`Category: ${product.category.name}`);
    if (product.details || product.description) {
      lines.push(`Details: ${product.details || product.description}`);
    }
    if (product.dimensions) lines.push(`Dimensions: ${product.dimensions}`);
    if (product.material) lines.push(`Material: ${product.material}`);
    lines.push('', `Link: ${productUrl}`);

    const text = encodeURIComponent(lines.join('\n'));
    const number = (whatsapp || '918385966614').replace(/\D/g, '');
    return `https://wa.me/${number}?text=${text}`;
  }

  return (
    <section className="section page-top">
      <div className="container product-detail">
        <div className="product-gallery">
          <div className="product-main-image">
            {images[activeImage] ? (
              <img src={mediaUrl(images[activeImage])} alt={product.name} />
            ) : (
              <div className="product-placeholder tall" />
            )}
          </div>
          {images.length > 1 && (
            <div className="thumb-row">
              {images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  className={i === activeImage ? 'active' : ''}
                  onClick={() => setActiveImage(i)}
                >
                  {img ? (
                    <img src={mediaUrl(img)} alt="" />
                  ) : (
                    <span className="product-placeholder" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          {product.category && (
            <Link to={`/shop/${product.category.slug}`} className="eyebrow">
              {product.category.name}
            </Link>
          )}
          <h1>{product.name}</h1>
          <p className="price">{formatPrice(product.price)}</p>
          {product.description && <p className="product-desc">{product.description}</p>}

          <dl className="product-specs">
            {product.details && (
              <div>
                <dt>Details</dt>
                <dd>{product.details}</dd>
              </div>
            )}
            {product.dimensions && (
              <div>
                <dt>Dimensions</dt>
                <dd>{product.dimensions}</dd>
              </div>
            )}
            {product.material && (
              <div>
                <dt>Material</dt>
                <dd>{product.material}</dd>
              </div>
            )}
          </dl>

          <a
            className="btn btn-primary"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Book on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
