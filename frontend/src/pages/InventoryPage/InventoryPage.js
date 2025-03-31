import './InventoryPage.css';
import InputField from '../../components/InputField/InputField';
import React, { useEffect, useState } from 'react';

const InventoryModal = ({handleSave, isOpen, setOpenModal, item}) => {
  
  console.log(item)
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item); // pre-fill formData when item is passed in
    }
  }, []); 
  
  if(!isOpen) return null;
  





  const onInputChange = (field, event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };





  return (
    <div className='modal'>
      <div className='modal-content'>
        <h1>{item.itemName} </h1>
        <div className='modal-content-body'>
        {Object.entries(item).map(([key, value]) => (
          key !== 'inventoryItemId' && key !== 'itemName' && (
            <InputField
              key={key}
              itemName={key}
              type={typeof value === 'number' ? 'number' : 'text'}
              value={formData[key]}
              onChange={onInputChange}
              text={key}
            />
          )
        ))}
        
        <button onClick={() => setOpenModal(false)}>
            CLOSE
        </button>
        </div>
      </div>
    </div>
  )

}

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [addQuantities, setAddQuantities] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState();
  

  useEffect(() => {
    fetchInventory();
  }, [])

  const fetchInventory = async () => {
    try {
        const response = await fetch('https://proj3-t62-backenddeploy-production.up.railway.app/inventory');
        const data = await response.json();
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

  const handleAddQuantity = (item) => {
    const quantityToAdd = parseFloat(addQuantities[item.itemName]) || 0;

    fetch(`https://proj3-t62-backenddeploy-production.up.railway.app/inventory/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemName: item.itemName,
        amountToAdd: quantityToAdd,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update quantity');
        }
        return res.json();
      })
      .then((updatedItem) => {
        // Replace updated item in the content array
        setInventory((prev) => ({
          ...prev,
          content: prev.content.map((invItem) =>
            invItem.itemName === updatedItem.itemName ? updatedItem : invItem
          ),
        }));

        setAddQuantities((prev) => ({
          ...prev,
          [item.itemName]: '',
        }));
      })
      .catch((error) => {
        console.error('Error updating quantity:', error);
      });
  };

  const handleDelete = (item) => {
    setOpenModal(false)
  };

  const handleSave = (item) => {
  };

  return (
    <div className="inventory-page">
    <InventoryModal
      isOpen={openModal}
      setOpenModal={setOpenModal}
      handleSave={handleSave}
      item={editItem}
    />
      <div className="inventory-container">
        <div className='inventory-header'>
          <h1>Boba Store Inventory</h1>
        </div>
        <div className='inventory-body'>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Desired Qty</th>
                <th>Stored Qty</th>
                <th>Unit</th>
                <th>Cost</th>
                <th>Add Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
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
                    <td>{item.itemName}</td>
                    <td>{item.desiredQuantity}</td>
                    <td>{item.storedQuantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.cost}</td>
                    <td>
                      <input
                        type="number"
                        step="any"
                        value={addQuantities[item.itemName] || ''}
                        onChange={(e) => handleInputChange(item.itemName, e)}
                      />
                      <button onClick={() => handleAddQuantity(item)}>
                        Add
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(item)}>
                        Delete
                      </button>
                      <button 
                      onClick={() => {
                        setEditItem(item);
                        setOpenModal(true);
                      }}>
                        Edit
                      </button>
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