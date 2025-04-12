import {useState, useContext, useEffect} from 'react'
import logo from './logo.svg';
import './App.css';
import CashierPage from './pages/CashierPage/CashierPage';
import HomePage from './pages/HomePage/HomePage';
import InventoryPage from './pages/InventoryPage/InventoryPage';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {UserContext, UserProvider} from './contexts/UserContext'

function AppContent() {
  const {userRole} = useContext(UserContext)
  const [showExtraButtons, setExtraButtons] = useState(true)
  const [allowedRoutes, setAllowedRoutes] = useState([])

  const navigate = useNavigate();

  const renderNavButtons = () => {
    if (!showExtraButtons) return <p className="muted-text">Extra buttons hidden</p>;
    console.log(userRole)
    switch (userRole) {
      case "cashier":
        return (
          <>
            <button onClick={() => navigate("/")}>Order</button>
            <button onClick={() => navigate("/cashierpage")}>Cashier</button>
            <button onClick={() => alert("Settings Page")}>Cashier</button>
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

  const getRoutePermissions = () => {
    if (!userRole ) return []
    switch (userRole) {
      case "cashier":
        return [
          {path: '/cashierpage', element: <CashierPage />},
          {path: '/', element: <HomePage />}
        ];
      case "manager":
        return [
          {path: '/cashierpage', element: <CashierPage />},
          {path: '/inventory', element: <InventoryPage />},
          {path: '/', element: <HomePage />}
        ];
      case "customer":
        return [
          {path: '/', element: <HomePage />},
          {path: '/inventory', element: <HomePage />},
        ];
      default:
        return null;
    }
  }

  useEffect(() => {
    const routes = getRoutePermissions();
    setAllowedRoutes(routes);
  }, [userRole])

  return (
    <div className="App">
      <div className="nav-bar">
        {showExtraButtons ? (
          <div className='nav-buttons'>
            {renderNavButtons()}
          </div>
        ) : (<p>extra buttons false</p>)
        }
        <button 
          onClick={() => setExtraButtons(!showExtraButtons)}
        >
          Show Extra Buttons
        </button>
      </div>
      <div className="body">
        <Routes>
          {allowedRoutes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<HomePage />} />          
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  ); 
}
