import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('eduverse_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('eduverse_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (course) => {
    setCartItems(prev => {
      // Prevent duplicates
      if (prev.find(item => item._id === course._id)) return prev;
      return [...prev, course];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (courseId) => {
    setCartItems(prev => prev.filter(item => item._id !== courseId));
  };

  const clearCart = () => setCartItems([]);

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartTotal = cartItems.reduce((sum, item) => {
    const priceStr = item.price || item.priceStr || '0';
    if (priceStr === 'Ücretsiz') return sum;
    const val = parseFloat(String(priceStr).replace('₺', '').replace(',', '.'));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, clearCart, cartTotal,
      isCartOpen, toggleCart, openCart, closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
