// src/pages/ManagerReportsPage/ManagerReportsPage.jsx
import React, { useState } from 'react';
import './ManagerReportsPage.css';
import { SERVER_URL } from '../../constant';

export default function ManagerReportsPage() {
  const tabs = ['Product Usage', 'X-Report', 'Z-Report', 'Sales Report'];
  const [active, setActive] = useState(tabs[0]);

  // Input state
  const [productStart, setProductStart] = useState('');
  const [productEnd, setProductEnd] = useState('');
  const [salesStart, setSalesStart] = useState('');
  const [salesEnd, setSalesEnd] = useState('');
  const [zDate, setZDate] = useState('');
  const [xDate, setXDate] = useState('');
  const [xTime, setXTime] = useState('');

  // Report data state
  const [zReport, setZReport] = useState(null);
  const [xReport, setXReport] = useState(null);
  const [productUsageData, setProductUsageData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError(''); setLoading(true);
    try {
      if (active === 'Z-Report') {
        if (!zDate) throw new Error('Please select a date');
        const res = await fetch(SERVER_URL + `/reports/z?date=${zDate}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setZReport(json);
      }
      else if (active === 'X-Report') {
        if (!xDate || !xTime) throw new Error('Please select date and time');
        const res = await fetch(SERVER_URL + `/reports/x?date=${xDate}&time=${xTime}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setXReport(json);
      }
      else if (active === 'Product Usage') {
        if (!productStart || !productEnd) throw new Error('Please select start/end dates');
        const res = await fetch(SERVER_URL + `/reports/product-usage?startDate=${productStart}&endDate=${productEnd}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setProductUsageData(json);
      }
      else if (active === 'Sales Report') {
        if (!salesStart || !salesEnd) throw new Error('Please select start/end dates');
        const res = await fetch(SERVER_URL + `/reports/sales?startDate=${salesStart}&endDate=${salesEnd}, 
            {method: 'GET', credentials: 'include'}`); 
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const json = await res.json();
        setSalesData(json);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (active) {
      case 'Z-Report':
        return (
          <div className="mrp-form">
            <label>
              Date:
              <input type="date" value={zDate} onChange={e => setZDate(e.target.value)} />
            </label>
            <button className="mrp-btn" onClick={handleGenerate}>Generate Z Report</button>
          </div>
        );
      case 'X-Report':
        return (
          <div className="mrp-form">
            <label>
              Date:
              <input type="date" value={xDate} onChange={e => setXDate(e.target.value)} />
            </label>
            <label>
              Time:
              <input type="time" value={xTime} onChange={e => setXTime(e.target.value)} />
            </label>
            <button className="mrp-btn" onClick={handleGenerate}>Generate X Report</button>
          </div>
        );
      case 'Product Usage':
        return (
          <div className="mrp-form">
            <label>
              Start Date:
              <input type="date" value={productStart} onChange={e => setProductStart(e.target.value)} />
            </label>
            <label>
              End Date:
              <input type="date" value={productEnd} onChange={e => setProductEnd(e.target.value)} />
            </label>
            <button className="mrp-btn" onClick={handleGenerate}>Generate Product Usage</button>
          </div>
        );
      case 'Sales Report':
        return (
          <div className="mrp-form">
            <label>
              Start Date:
              <input type="date" value={salesStart} onChange={e => setSalesStart(e.target.value)} />
            </label>
            <label>
              End Date:
              <input type="date" value={salesEnd} onChange={e => setSalesEnd(e.target.value)} />
            </label>
            <button className="mrp-btn" onClick={handleGenerate}>Generate Sales Report</button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderResult = () => {
    if (error) return <div className="mrp-error">{error}</div>;
    if (loading) return <div className="mrp-loading">Loading...</div>;

    if (active === 'Z-Report' && zReport) {
      return (
        <table className="mrp-table">
          <tbody>
            <tr><th>Report Date</th><td>{zReport.reportDate}</td></tr>
            <tr><th>Net Sales</th><td>{zReport.netSales}</td></tr>
            <tr><th>Gross Sales</th><td>{zReport.grossSales}</td></tr>
            <tr><th>Refunds</th><td>{zReport.refunds}</td></tr>
            <tr><th>Cost</th><td>{zReport.cost}</td></tr>
          </tbody>
        </table>
      );
    }

    if (active === 'X-Report' && xReport) {
      return (
        <table className="mrp-table">
          <tbody>
            <tr><th>Report Date</th><td>{xReport.reportDate}</td></tr>
            <tr><th>Report Time</th><td>{xReport.reportTime}</td></tr>
            <tr><th>Net Sales</th><td>{xReport.netSales}</td></tr>
            <tr><th>Gross Sales</th><td>{xReport.grossSales}</td></tr>
            <tr><th>Refunds</th><td>{xReport.refunds}</td></tr>
            <tr><th>Cost</th><td>{xReport.cost}</td></tr>
          </tbody>
        </table>
      );
    }

    if (active === 'Product Usage' && productUsageData.length) {
      return (
        <table className="mrp-table">
          <thead>
            <tr><th>Item</th><th>Used Quantity</th></tr>
          </thead>
          <tbody>
            {productUsageData.map((row, i) => (
              <tr key={i}>
                <td>{row.inventoryItemName}</td>
                <td>{row.usedQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (active === 'Sales Report' && salesData.length) {
      return (
        <table className="mrp-table">
          <thead>
            <tr><th>Item</th><th>Quantity</th><th>Revenue</th></tr>
          </thead>
          <tbody>
            {salesData.map((row, i) => (
              <tr key={i}>
                <td>{row.itemName}</td>
                <td>{row.totalQuantity}</td>
                <td>${row.totalRevenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  };

  return (
    <div className="mrp-container">
      <h1 className="mrp-title">Manager Reports</h1>
      <div className="ct-container">
        <div className="ct-tab-list">
          {tabs.map(label => (
            <button
              key={label}
              className={`ct-tab ${label === active ? 'active' : ''}`}
              onClick={() => setActive(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ct-panel">
          {renderForm()}
          {renderResult()}
        </div>
      </div>
    </div>
  );
}