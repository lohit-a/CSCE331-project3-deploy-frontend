// src/pages/HomePage/HomePage.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import bobaImage from "./images/boba.png";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserProvider';

function HomePage() {

  const { user, loadingUser } = useContext(UserContext);

  const role = user?.roles?.[0]?.replace("ROLE_", "").toLowerCase();

  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Inject Google Translate widget script and style
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,fr,zh-CN,ar",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };

      const gtScript = document.createElement("script");
      gtScript.id = "google-translate-script";
      gtScript.type = "text/javascript";
      gtScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      gtScript.async = true;
      gtScript.defer = true;
      document.body.appendChild(gtScript);
    }

    if (!document.getElementById("google-translate-style")) {
      const style = document.createElement("style");
      style.id = "google-translate-style";
      style.innerHTML = `
        iframe.goog-te-banner-frame { display: none !important; visibility: hidden; }
        html { margin-top: 0px !important; }
        .goog-te-banner-frame.skiptranslate,
        .goog-te-gadget-icon,
        body > .goog-te-spinner-pos { display: none !important; }
        body { top: 0px !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Fetch menu items from API
  useEffect(() => {
    fetch("http://localhost:8081/menu_items", {
        method: 'GET',
        credentials: 'include'
      })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        console.log("fetched menuItems:", data);
        setMenuItems(data);
        setCategories([...new Set(data.map((i) => i.category))]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Add to cart
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.menuItemId === item.menuItemId);
      if (exists) {
        return prev.map((c) =>
          c.menuItemId === item.menuItemId
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Quantity controls
  const incrementItem = (id) =>
    setCart((prev) =>
      prev.map((c) =>
        c.menuItemId === id ? { ...c, quantity: c.quantity + 1 } : c
      )
    );

  const decrementItem = (id) =>
    setCart((prev) =>
      prev
        .map((c) =>
          c.menuItemId === id
            ? c.quantity > 1
              ? { ...c, quantity: c.quantity - 1 }
              : null
            : c
        )
        .filter(Boolean)
    );

  // Place order logic
  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);

    const totalAmount = parseFloat(
      cart.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2)
    );

    const orderPayload = {
      cashierId: 1,        // replace with dynamic cashier ID as needed
      totalAmount,
      orderItems: cart.map((c) => ({
        menuItemId: c.menuItemId,
        quantity: c.quantity,
        sugarPercentage: 100,  // default until you add UI controls
        icePercentage: 100,    // default until you add UI controls
        isBoba: true,          // default flags
        isPopper: false,
        isJelly: false,
      })),
    };

    try {
      const res = await fetch("http://localhost:8081/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();
      alert(`✅ Order #${created.orderId} placed! Total $${created.totalAmount}`);
      setCart([]);
    } catch (err) {
      console.error("Place order failed:", err);
      alert("❌ Could not place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  return (
    <div className="page-container">
      <div className="homepage-container">
        {/* Center Section */}
        <div className="center-section">
          <div className="translate-box-inline">
            <label htmlFor="google_translate_element" style={{ fontWeight: "bold" }}>
              Select Language:
            </label>
            <p>Your role: <strong>{role || "unknown"}</strong></p>
            <div id="google_translate_element" style={{ marginTop: "0.5rem" }} />
          </div>

          {loading && <p>Loading menu items…</p>}
          {error && <p>Error: {error.message}</p>}

          {!loading && !error && (
            <>
              <div className="category-buttons">
                <button
                  className={selectedCategory === "All" ? "active" : ""}
                  onClick={() => setSelectedCategory("All")}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={selectedCategory === cat ? "active" : ""}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid-container">
                {filteredItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="grid-item"
                    onClick={() => handleAddToCart(item)}
                  >
                    <img src={bobaImage} alt={item.itemName} />
                    <p>{item.itemName.replace(/_/g, " ")}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Options Panel */}
        <div className={`options-panel ${isPanelOpen ? "open" : ""}`}>
          <button onClick={() => setIsPanelOpen((o) => !o)}>
            {isPanelOpen ? ">" : "<"}
          </button>
          {isPanelOpen && <div className="panel-content">…</div>}
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <h2>Cart</h2>
          {cart.length === 0 && <p>No items yet.</p>}
          {cart.map((c) => (
            <div key={c.menuItemId} className="cart-item">
              <span>{c.itemName.replace(/_/g, " ")}</span>
              <div className="quantity-controls">
                <button onClick={() => decrementItem(c.menuItemId)}>–</button>
                <span>{c.quantity}</span>
                <button onClick={() => incrementItem(c.menuItemId)}>+</button>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <button
              className="checkout-btn"
              onClick={placeOrder}
              disabled={placing}
            >
              {placing ? "Placing…" : "Place Order"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
