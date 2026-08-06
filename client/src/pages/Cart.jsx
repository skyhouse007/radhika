import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api, formatPrice, mediaUrl } from '../lib/api';

export default function Cart() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    api('/api/config')
      .then((cfg) => setWhatsapp(cfg.whatsapp || ''))
      .catch(() => {});
  }, []);

  function buildWhatsAppUrl() {
    const lines = [
      'Hi Radhika! I would like to inquire about the following items:',
      '',
      ...items.map(
        (item) =>
          `• ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`
      ),
      '',
      `Total: ${formatPrice(total)}`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    const number = (whatsapp || '').replace(/\D/g, '');
    return `https://wa.me/${number}?text=${text}`;
  }

  if (items.length === 0) {
    return (
      <section className="section page-top">
        <div className="container">
          <h1>Cart</h1>
          <p className="muted">Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section page-top">
      <div className="container cart-layout">
        <div>
          <h1>Cart</h1>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item._id} className="cart-item">
                <div className="cart-thumb">
                  {item.image ? (
                    <img src={mediaUrl(item.image)} alt="" />
                  ) : (
                    <div className="product-placeholder" />
                  )}
                </div>
                <div className="cart-info">
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  <p>{formatPrice(item.price)}</p>
                  <div className="qty-row">
                    <label>
                      Qty
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item._id, Math.max(1, Number(e.target.value) || 1))
                        }
                      />
                    </label>
                    <button type="button" className="text-btn" onClick={() => removeItem(item._id)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="cart-line-total">{formatPrice(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="cart-summary">
          <h2>Order inquiry</h2>
          <p className="muted">
            No online payment yet. Send your cart on WhatsApp and we will confirm availability and
            shipping.
          </p>
          <p className="cart-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </p>
          <a
            className="btn btn-primary"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Inquire on WhatsApp
          </a>
          <button type="button" className="text-btn" onClick={clearCart}>
            Clear cart
          </button>
        </aside>
      </div>
    </section>
  );
}
