import React, { useState, useEffect } from 'react';
import './HomePage.css';
import bobaImage from './images/boba.png'; // Ensure this path is correct

function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  // Fetch menu items from the API
  useEffect(() => {
    fetch('http://localhost:8081/menu_items') // need to change this once deployed
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMenuItems(data);
        // Extract unique categories from data
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Add an item to the cart
  const handleAddToCart = (item) => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.menu_item_id === item.menu_item_id);
      if (existing) {
        return prevCart.map(c =>
          c.menu_item_id === item.menu_item_id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Filter items by selected category (or show all)
  const filteredItems =
    selectedCategory === 'All'
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);

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
                  key={item.menu_item_id}
                  className="grid-item"
                  onClick={() => handleAddToCart(item)}
                >
                  <img src={bobaImage} alt={item.item_name} />
                  <p>{item.item_name.replace(/_/g, ' ')}</p>
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
          <div key={c.menu_item_id} className="cart-item">
            <span>{c.item_name.replace(/_/g, ' ')}</span>
            <span>x {c.quantity}</span>
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
