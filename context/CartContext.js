import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === id);
      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        if (updatedCart[existingIndex].quantity > 1) {
          updatedCart[existingIndex].quantity -= 1;
          return updatedCart;
        }
        return prevCart.filter((item) => item.id !== id);
      }
      return prevCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getEstimatedPrepTime = () => {
    if (cart.length === 0) return 0;
    const maxItemTime = Math.max(...cart.map((item) => item.prepTime));
    const extraBuffer = Math.floor(cart.reduce((sum, item) => sum + item.quantity, 0) * 1.5);
    return maxItemTime + extraBuffer;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getEstimatedPrepTime,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);