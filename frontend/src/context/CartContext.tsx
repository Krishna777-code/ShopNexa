import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(item => item.productId === newItem.productId);
      if (existing) {
        return prev.map(item => 
          item.productId === newItem.productId 
            ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.stock) }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
      setCart(prev => prev.map(item =>
        item.productId === productId ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) } : item
      ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
