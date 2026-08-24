import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('waitwise_cart');
      return saved ? JSON.parse(saved) : { canteenId: 'main-campus', items: [] };
    } catch {
      return { canteenId: 'main-campus', items: [] };
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('waitwise_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('waitwise_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not persist cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('waitwise_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('waitwise_active_order');
      }
    } catch (e) {
      console.warn('Could not persist active order:', e);
    }
  }, [activeOrder]);

  const addToCart = (item, canteenId = 'main-campus') => {
    setCart((prev) => {
      const isDifferentCanteen = prev.canteenId !== canteenId && prev.items.length > 0;
      const currentItems = isDifferentCanteen ? [] : prev.items;

      const existingIndex = currentItems.findIndex((i) => i.id === item.id);
      let updatedItems;

      if (existingIndex > -1) {
        updatedItems = currentItems.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        updatedItems = [
          ...currentItems,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
            isVeg: item.isVeg,
            preparationTime: item.preparationTime || 5,
            quantity: item.quantity || 1,
          },
        ];
      }

      return {
        canteenId,
        items: updatedItems,
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }));
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) => {
      const updated = prev.items
        .map((i) => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean);

      return {
        ...prev,
        items: updated,
      };
    });
  };

  const clearCart = () => {
    setCart((prev) => ({ ...prev, items: [] }));
  };

  const setCanteenId = (canteenId) => {
    setCart((prev) => ({ ...prev, canteenId }));
  };

  const totalItemsCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const maxPrepTime = cart.items.length > 0 
    ? Math.max(...cart.items.map((i) => i.preparationTime || 5))
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        canteenId: cart.canteenId,
        setCanteenId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        maxPrepTime,
        isDrawerOpen,
        setIsDrawerOpen,
        activeOrder,
        setActiveOrder,
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
