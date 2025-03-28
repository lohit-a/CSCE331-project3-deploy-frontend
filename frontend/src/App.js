import {useState} from 'react'
import logo from './logo.svg';
import './App.css';
import CashierPage from './pages/CashierPage/CashierPage';
import HomePage from './pages/HomePage/HomePage';
import {Routes, Route, useNavigate} from 'react-router-dom';

function App() {
  const [showExtraButtons, setExtraButtons] = useState(true)

  const navigate = useNavigate();



  return (
    <div className="App">
      <div className="nav-bar">
        {showExtraButtons ? (
          <div className='nav-buttons'>
            <button onClick={() => navigate("/")}>
              Home
            </button>
            <button onClick={() => navigate("/cashierpage")}>
              Cashier
            </button>
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
          <Route path="/cashierpage" element={<CashierPage />}/>
          <Route path="" element={<HomePage />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
