import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'radhika_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    function addItem(product, quantity = 1) {
      setItems((prev) => {
        const existing = prev.find((i) => i._id === product._id);
        if (existing) {
          return prev.map((i) =>
            i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [
          ...prev,
          {
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images?.[0] || '',
            quantity,
          },
        ];
      });
    }

    function updateQuantity(id, quantity) {
      setItems((prev) =>
        prev
          .map((i) => (i._id === id ? { ...i, quantity } : i))
          .filter((i) => i.quantity > 0)
      );
    }

    function removeItem(id) {
      setItems((prev) => prev.filter((i) => i._id !== id));
    }

    function clearCart() {
      setItems([]);
    }

    return { items, count, total, addItem, updateQuantity, removeItem, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
