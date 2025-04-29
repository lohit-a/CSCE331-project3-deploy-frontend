// src/pages/HomePage/HomePage.js

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import fruitBoba from "./images/fruit.png";
import milkBoba from "./images/milk.png";
import brewedBoba from "./images/brewed.png";
import seasonalBoba from "./images/Seasonal.png";
// import defaultBoba from "./images/Default.png";
import { UserContext } from "../../contexts/UserProvider";

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

  // pick image based on category
  const getImageForCategory = (category) => {
    switch (category.toLowerCase()) {
      case "seasonal":
        return seasonalBoba;
      case "milk":
        return milkBoba;
      case "fruit":
        return fruitBoba;
      case "brewed":
        return brewedBoba;
      default:
        return milkBoba;
    }
  };

  // Inject Google Translate widget
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,es,fr,zh-CN,ar",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
      const gtScript = document.createElement("script");
      gtScript.id = "google-translate-script";
      gtScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      gtScript.async = true;
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

  // Fetch menu items
  useEffect(() => {
    fetch("http://localhost:8081/menu_items", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setMenuItems(data);
        setCategories([...new Set(data.map((i) => i.category))]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Cart operations
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

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);

    const totalAmount = parseFloat(
      cart.reduce((sum, c) => sum + c.price * c.quantity, 0).toFixed(2)
    );

    const orderPayload = {
      cashierId: 1, // TODO: dynamic
      totalAmount,
      orderItems: cart.map((c) => ({
        menuItemId: c.menuItemId,
        quantity: c.quantity,
        sugarPercentage: 100,
        icePercentage: 100,
        isBoba: true,
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
      alert(
        `✅ Order #${created.orderId} placed! Total $${created.totalAmount}`
      );
      setCart([]);
    } catch (err) {
      console.error("Place order failed:", err);
      alert("❌ Could not place order. Try again.");
    } finally {
      setPlacing(false);
    }
  };

  // Filter and then sort by category
  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((i) => i.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) =>
    a.category.localeCompare(b.category)
  );

  // Compute cart total
  const cartTotal = cart
    .reduce((sum, c) => sum + c.price * c.quantity, 0)
    .toFixed(2);

  return (
    <div className="page-container">
      <div className="homepage-container">
        {/* Center */}
        <div className="center-section">
          <div className="translate-box-inline">
            <label htmlFor="google_translate_element">
              <strong>Select Language:</strong>
            </label>
            <p>
              Your role: <strong>{role || "unknown"}</strong>
            </p>
            <div
              id="google_translate_element"
              style={{ marginTop: "0.5rem" }}
            />
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
                {sortedItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="grid-item"
                    onClick={() => handleAddToCart(item)}
                  >
                    <img
                      src={getImageForCategory(item.category)}
                      alt={item.itemName}
                    />
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

        {/* Cart */}
        <div className="cart-section">
          <h2>Cart</h2>
          {cart.length === 0 && <p>No items yet.</p>}
          {cart.map((c) => (
            <div key={c.menuItemId} className="cart-item">
              <span>{c.itemName.replace(/_/g, " ")}</span>
              <div className="quantity-controls">
                <button onClick={() => decrementItem(c.menuItemId)}>
                  –
                </button>
                <span>{c.quantity}</span>
                <button onClick={() => incrementItem(c.menuItemId)}>
                  +
                </button>
              </div>
            </div>
          ))}

          {cart.length > 0 && (
            <>
              <div className="cart-total">
                <span>Total:</span>
                <span>${cartTotal}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={placeOrder}
                disabled={placing}
              >
                {placing ? "Placing…" : "Place Order"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
