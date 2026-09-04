import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('tvarit_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: '1', itemName: '2 kg Rice', itemQuantity: 2, unit: 'kg', estimatedPrice: 120, notes: 'Sona Masoori' },
      { id: '2', itemName: '1 packet Sugar', itemQuantity: 1, unit: 'packet', estimatedPrice: 45, notes: '' },
      { id: '3', itemName: '2 Milk', itemQuantity: 2, unit: 'packet', estimatedPrice: 60, notes: 'Fresh pack' },
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('tvarit_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.itemName.toLowerCase() === item.itemName.toLowerCase());
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex].itemQuantity += (item.itemQuantity || 1);
        return updated;
      }
      return [...prev, { ...item, id: Date.now() + Math.random().toString(36).substring(2, 6) }];
    });
  };

  const addItems = (items) => {
    setCartItems((prev) => {
      let updated = [...prev];
      for (const item of items) {
        const existingIndex = updated.findIndex((i) => i.itemName.toLowerCase() === item.itemName.toLowerCase());
        if (existingIndex >= 0) {
          updated[existingIndex].itemQuantity += (item.itemQuantity || 1);
        } else {
          updated.push({ ...item, id: Date.now() + Math.random().toString(36).substring(2, 7) });
        }
      }
      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, itemQuantity: quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + (curr.itemQuantity || 1), 0);
  const cartTotal = cartItems.reduce(
    (acc, curr) => acc + (curr.estimatedPrice || 40) * (curr.itemQuantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        addItems,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
