import { useState, useContext, useEffect } from 'react';
import './App.css';
import UserPage from './pages/UserPage/UserPage';
import HomePage from './pages/HomePage/HomePage';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import LoginPage from './pages/LogInPage/LogInPage'; 
import RequireUser from './components/RequireUser/RequireUser';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { UserContext } from './contexts/UserProvider';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage';
import Weather from './components/Weather'; // Import the Weather component

function AppContent() {
  const { user, loading } = useContext(UserContext);
  const [showExtraButtons, setExtraButtons] = useState(true);
  
  const navigate = useNavigate();

  const userRole = user?.roles?.[0]?.replace("ROLE_", "").toLowerCase(); 

  const renderNavButtons = () => {
    if (!showExtraButtons) return <p className="muted-text">Extra buttons hidden</p>;
    switch (userRole) {
      case "cashier":
        return (
          <>
            <button onClick={() => navigate("/")}>Order</button>
            <button onClick={() => navigate("/userpage")}>Cashier</button>
          </>
        );
      case "manager":
        return (
          <>
            <button onClick={() => navigate("/")}>Order</button>
            <button onClick={() => navigate("/userpage")}>Cashier</button>
            <button onClick={() => navigate("/inventory")}>Inventory</button>
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

  

  

  if (loading) return <div>Loading...</div>;
  if (user?.error === "backend-offline") return <div>Backend is offline. Lohit messed up fr fr</div>;

  return (
    <div className="App">
      {/* Banner moved to the top of the DOM */}
      {/* <div className="banner">LoTree Tea</div> */}
      
      <div className="nav-bar">
        {showExtraButtons && (
          <div className="nav-buttons">{renderNavButtons()}</div>
        )}
        <button onClick={() => setExtraButtons(!showExtraButtons)}>
          Show Extra Buttons
        </button>
        {/* Weather component added to the navigation bar */}
        <Weather />
      </div>

      <div className="body">
      <Routes>
  {/* Public route */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/unauthorized" element={<UnauthorizedPage />} />

  {/* Home: all users */}
  <Route element={<RequireUser allowedRoles={["cashier", "manager", "customer"]} />}>
    <Route path="/" element={<HomePage />} />
  </Route>

  {/* Cashier and manager */}
  <Route element={<RequireUser allowedRoles={["cashier", "manager"]} />}>
    <Route path="/userpage" element={<UserPage />} />
  </Route>

  {/* Manager only */}
  <Route element={<RequireUser allowedRoles={["manager"]} />}>
    <Route path="/inventory" element={<InventoryPage />} />
  </Route>

  {/* Catch-all: redirect to login */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
      </div>
    </div>
  );
}

export default AppContent;
