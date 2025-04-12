import './InventoryPage.css';
import InputField from '../../components/InputField/InputField';
import InventoryModal from '../../components/InventoryModal/InventoryModal';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from "../../constant";



function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [addQuantities, setAddQuantities] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState();
  const [modalMode, setModalMode] = useState('add');
  

  useEffect(() => {
    fetchInventory();
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch(SERVER_URL + '/inventory', {
        method: 'GET',
        
        credentials: 'include' 
      }).then((response => response));
  
      
      if (response.redirected) {
        window.location.href = response.url; // see #4 below
        return;
      }
  
      
      const data = await response.json();
      console.log(data);
      setInventory(data);
  
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleInputChange = (itemName, event) => {
    setAddQuantities((prev) => ({
      ...prev,
      [itemName]: event.target.value,
    }));
  };

  

  const handleDelete = (item) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.itemName}"?`);
    if (!confirmDelete) return;
  
    fetch(SERVER_URL + `/inventory/${item.inventoryItemId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete item');
        }
        // Remove item from local state
        setInventory((prev) =>
          prev.filter((invItem) => invItem.inventoryItemId !== item.inventoryItemId)
        );
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        alert('Failed to delete item.');
      });
  };

  const handleSave = (item) => {
    fetchInventory();
  };

  return (
    <div className="inventory-page">
    <InventoryModal
      isOpen={openModal}
      setOpenModal={setOpenModal}
      handleSave={handleSave}
      item={editItem}
      mode={modalMode}
    />
      <div className="inventory-container">
        <div className='inventory-header'>
          <h1>Manage Inventory</h1>
        </div>
        <div className='inventory-body'>
          <table className="inventory-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th >Item Name</th>
                <th >Desired Qty</th>
                <th>Stored Qty</th>
                <th>Unit</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => {
                const ratio = item.storedQuantity / item.desiredQuantity;
                let rowClass = '';
                if (ratio < 0.2) {
                  rowClass = 'red-row';
                } else if (ratio < 0.6) {
                  rowClass = 'yellow-row';
                } else {
                  rowClass = 'green-row';
                }

                return (
                  <tr key={item.inventoryItemId} className={rowClass}>
                    <td>{index + 1}</td> {/* ✅ Show the row number, starting from 1 */}
                    <td>{item.itemName}</td>
                    <td>{item.desiredQuantity}</td>
                    <td>{item.storedQuantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.cost}</td>
                    
                    <td>
                    <div>
                    <button
                    className="btn btn-add"
                    onClick={() => {
                      setEditItem(item);
                      setOpenModal(true);
                      setModalMode('add');
                    }}
                  >
                    Add
                  </button>

                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditItem(item);
                      setOpenModal(true);
                      setModalMode('edit');
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(item)}
                  >
                    Delete
                  </button>
                    </div>
                    
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          
        </div>
      </div>
      
    </div>
  );
}

export default InventoryPage;