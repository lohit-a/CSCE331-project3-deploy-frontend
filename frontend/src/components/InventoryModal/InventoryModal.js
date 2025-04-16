import React, { useState, useEffect } from 'react';
import './InventoryModal.css';
import InputField from '../InputField/InputField';

const InventoryModal = ({handleSave, isOpen, setOpenModal, item = null, mode = 'add'}) => {
  
    console.log(item)
    const [formData, setFormData] = useState({
      itemName: '',
      desiredQuantity: '',
      storedQuantity: '',
      unit: '',
      cost: '',
    });
  
    useEffect(() => {
      if (mode === 'edit' && item) {
        setFormData(item);
      } else {
        setFormData({
          itemName: '',
          desiredQuantity: '',
          storedQuantity: '',
          unit: '',
          cost: '',
        });
      }
    }, [item, mode]);
  
    const onInputChange = (field, event) => {
        const value = event.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const roundDec = (num) => parseFloat(parseFloat(num).toFixed(2));
    
    const handleSubmit = () => {
       const updated = {
            ...formData,
            desiredQuantity: roundDec(formData.desiredQuantity),
            storedQuantity: roundDec(formData.storedQuantity),
            cost: roundDec(formData.cost)
        };
        const url =
      mode === 'edit'
        ? `https://proj3-t62-backenddeploy-production.up.railway.app/inventory/${item.inventoryItemId}`
        : 'https://proj3-t62-backenddeploy-production.up.railway.app/inventory';

      const method = mode === 'edit' ? 'PATCH' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to save item');
        return res.json();
      })
      .then((data) => {
        handleSave(data);
        setOpenModal(false);
      })
      .catch(console.error);
    };
  
    if(!isOpen) return null;
  
    return (
        <div className='modal'>
            <div className='modal-content'>
            <h1>{mode === 'edit' ? `Edit: ${formData.itemName}` : 'Add Inventory Item'}</h1>
           
                <div className='modal-content-body'>
          <InputField
            itemName="itemName"
            type="text"
            value={formData.itemName}
            onChange={onInputChange}
            text="Item Name"
          />

          <InputField
            itemName="desiredQuantity"
            type="number"
            value={formData.desiredQuantity}
            onChange={onInputChange}
            text="Desired Quantity"
          />
  
          <InputField
            itemName="storedQuantity"
            type="number"
            value={formData.storedQuantity}
            onChange={onInputChange}
            text="Stored Quantity"
          />
  
          <InputField
            itemName="unit"
            type="text"
            value={formData.unit}
            onChange={onInputChange}
            text="Unit"
          />
  
          <InputField
            itemName="cost"
            type="number"
            value={formData.cost}
            onChange={onInputChange}
            text="Cost per Unit"
          />
        </div>
          <button onClick={handleSubmit}>SAVE</button>
          <button onClick={() => {setFormData(item);setOpenModal(false); }}>
              CLOSE
          </button>
          </div>

      </div>
    )
  
  }
  export default InventoryModal;