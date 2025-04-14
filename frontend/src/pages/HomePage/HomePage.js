import React, { useState, useEffect } from "react";
import "./HomePage.css";
import bobaImage from "./images/boba.png";

function HomePage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
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
      gtScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
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
    fetch("http://localhost:8081/menu_items")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        data.forEach((item, i) => {
          if (!item.item_name) console.warn(`Missing item_name at index ${i}:`, item);
        });
        setMenuItems(data);
        const uniqueCats = [...new Set(data.map((item) => item.category))];
        setCategories(uniqueCats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const exist = prevCart.find((c) => c.menu_item_id === item.menu_item_id);
      if (exist) {
        return prevCart.map((c) =>
          c.menu_item_id === item.menu_item_id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const incrementItem = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.menu_item_id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementItem = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.menu_item_id === id) {
            if (item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
            else return null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="page-container">
      {/* Main content container arranged in a row */}
      <div className="homepage-container">
        {/* Center Section */}
        <div className="center-section">
          {/* Google Translate Widget moved inline */}
          <div className="translate-box-inline">
            <label htmlFor="google_translate_element" style={{ fontWeight: "bold" }}>
              Select Language:
            </label>
            <div id="google_translate_element" style={{ marginTop: "0.5rem" }}></div>
          </div>

          {loading && <p>Loading menu items...</p>}
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
                    key={item.menu_item_id}
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

        {/* Collapsible Options Panel */}
        <div className={`options-panel ${isPanelOpen ? "open" : ""}`}>
          <button
            className="toggle-btn"
            onClick={() => setIsPanelOpen(!isPanelOpen)}
          >
            {isPanelOpen ? ">" : "<"}
          </button>
          {isPanelOpen && (
            <div className="panel-content">
              <h3>Future Features like chatbot and stuff</h3>
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <h2>Cart</h2>
          {cart.length === 0 && <p>No items yet.</p>}
          {cart.map((c) => (
            <div key={c.menu_item_id} className="cart-item">
              <span>{c.itemName.replace(/_/g, " ")}</span>
              <div className="quantity-controls">
                <button onClick={() => decrementItem(c.menu_item_id)}>-</button>
                <span>{c.quantity}</span>
                <button onClick={() => incrementItem(c.menu_item_id)}>+</button>
              </div>
            </div>
          ))}
          {cart.length > 0 && <button className="checkout-btn">CHECKOUT</button>}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
