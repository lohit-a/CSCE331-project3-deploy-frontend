import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CashierPage from './pages/CashierPage/CashierPage';
import HomePage from './pages/HomePage/HomePage';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [showExtraButtons, setExtraButtons] = useState(true);
  const [userRole, setUserRole] = useState("manager");
  const navigate = useNavigate();

  const renderNavButtons = () => {
    if (!showExtraButtons) return <p className="muted-text">Extra buttons hidden</p>;
    switch (userRole) {
      case "cashier":
        return (
          <>
            <button onClick={() => navigate("/")}>Order</button>
            <button onClick={() => navigate("/cashierpage")}>Cashier</button>
            <button onClick={() => alert("Settings Page")}>Settings</button>
          </>
        );
      case "manager":
        return (
          <>
            <button onClick={() => navigate("/")}>Order</button>
            <button onClick={() => navigate("/cashierpage")}>Cashier</button>
            <button onClick={() => navigate("/inventory")}>Inventory</button>
            <button onClick={() => alert("Manager Page")}>Manager</button>
          </>
        );
      case "customer":
        return (
          <>
            <button onClick={() => navigate("/")}>Order</button>
            <button onClick={() => alert("View Orders")}>My Orders</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {/* Banner moved to the top of the DOM */}
      <div className="banner">LoTree Tea</div>
      
      <div className="nav-bar">
        {showExtraButtons ? (
          <div className="nav-buttons">
            {renderNavButtons()}
          </div>
        ) : (
          <p className="muted-text">Extra buttons hidden</p>
        )}
        <button onClick={() => setExtraButtons(!showExtraButtons)}>
          Show Extra Buttons
        </button>
      </div>
      
      <div className="body">
        <Routes>
          <Route path="/cashierpage" element={<CashierPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
