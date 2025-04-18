import React, { useState, useEffect } from 'react';
import './CashierPage.css';
import bobaImage from './images/boba.png'; // Ensure this path is correct

function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Removed Google Translate related useEffect and code

  // Fetch menu items from the API
  useEffect(() => {
    fetch('https://proj3-t62-backenddeploy-production.up.railway.app/menu_items')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMenuItems(data);
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find(c => c.menuItemId === item.menuItemId);
      if (existing) {
        return prevCart.map((c) =>
          c.menuItemId === item.menuItemId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const incrementItem = (menuItemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementItem = (menuItemId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.menuItemId === menuItemId) {
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return null;
            }
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const filteredItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="homepage-container">
      {/* Center Section */}
      <div className="center-section">
        {loading && <p>Loading menu items...</p>}
        {error && <p>Error loading menu items: {error.message}</p>}

        {!loading && !error && (
          <>
            {/* Category Buttons */}
            <div className="category-buttons">
              <button
                className={selectedCategory === 'All' ? 'active' : ''}
                onClick={() => setSelectedCategory('All')}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={selectedCategory === cat ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Menu Items */}
            <div className="grid-container">
              {filteredItems.map((item) => (
                <div
                  key={item.menuItemId}
                  className="grid-item"
                  onClick={() => handleAddToCart(item)}
                >
                  <img src={bobaImage} alt={item.itemName} />
                  <p>{item.itemName.replace(/_/g, ' ')}</p>
                  <p>${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Section - Cart */}
      <div className="cart-section">
        <h2>Cart</h2>
        {cart.length === 0 && <p>No items yet.</p>}

        {cart.map((c) => (
          <div key={c.menuItemId} className="cart-item">
            <span>{c.itemName.replace(/_/g, ' ')}</span>
            <div className="quantity-controls">
              <button onClick={() => decrementItem(c.menuItemId)}>-</button>
              <span>{c.quantity}</span>
              <button onClick={() => incrementItem(c.menuItemId)}>+</button>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <button className="checkout-btn">CHECKOUT</button>
        )}
      </div>
    </div>
  );
}

export default HomePage;
