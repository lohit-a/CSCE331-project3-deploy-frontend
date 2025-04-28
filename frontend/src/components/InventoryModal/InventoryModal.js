import React, { useState, useEffect } from 'react';
import './InventoryModal.css';
import InputField from '../InputField/InputField';
import { SERVER_URL } from "../../constant";

const InventoryModal = ({ handleSave, isOpen, setOpenModal, item = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    desiredQuantity: '',
    storedQuantity: '',
    unit: '',
    cost: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

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
    setSelectedFile(null);
  }, [item, mode]);

  const onInputChange = (field, event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const roundDec = num => parseFloat(parseFloat(num).toFixed(2));

  const handleSubmit = async () => {
    try {
      // 1) If a file was picked, upload it first
      let photoFilename = null;
      if (selectedFile) {
        const fd = new FormData();
        // rename upload to "<itemName>.png"
        fd.append('file', selectedFile, `${formData.itemName}.png`);

        const uploadRes = await fetch(`${SERVER_URL}/api/photos/upload`, {
          method: 'POST',
          body: fd,
          credentials: 'include'
        });
        if (!uploadRes.ok) throw new Error('Photo upload failed');
        photoFilename = await uploadRes.text(); // returns the stored filename
      }

      // 2) Prepare your inventory payload
      const updated = {
        ...formData,
        desiredQuantity: roundDec(formData.desiredQuantity),
        storedQuantity: roundDec(formData.storedQuantity),
        cost:           roundDec(formData.cost),
        ...(photoFilename && { photoFilename })
      };

      const url = mode === 'edit'
        ? `${SERVER_URL}/inventory/${item.inventoryItemId}`
        : `${SERVER_URL}/inventory`;
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      // 3) Send inventory data
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save item');

      const savedItem = await res.json();
      handleSave(savedItem);
      setOpenModal(false);

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (!isOpen) return null;

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

          {/* ← NEW FILE INPUT */}
          <div className="file-input">
            <label htmlFor="photo">Photo (PNG)</label>
            <input
              id="photo"
              type="file"
              accept="image/png"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
          </div>
        </div>

        <button onClick={handleSubmit}>SAVE</button>
        <button onClick={() => { setFormData(item); setOpenModal(false); }}>
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default InventoryModal;
