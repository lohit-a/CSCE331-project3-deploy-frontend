import React, { useState, useEffect } from 'react';
import './MenuModal.css';
import InputField from '../InputField/InputField';

const MenuModal = ({handleSave, isOpen, setOpenModal, item = null, mode = 'add'}) => {
  
    console.log(item)
    const [formData, setFormData] = useState({
      item_name: '',
      category: '',
      price: '',
    });
  
    useEffect(() => {
      if (mode === 'edit' && item) {
        setFormData(item);
      } else {
        setFormData({
          item_name: '',
          category: '',
          price: '',
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
            price: roundDec(formData.price)
        };
        const url =
      mode === 'edit'
        ? `http://localhost:8081/menu_items/${item.menu_item_id}`
        : 'http://localhost:8081/menu_items';

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
            <h1>{mode === 'edit' ? `Edit: ${formData.item_name}` : 'Add Menu Item'}</h1>
           
                <div className='modal-content-body'>
          <InputField
            itemName="itemName"
            type="text"
            value={formData.item_name}
            onChange={onInputChange}
            text="Item Name"
          />
  
          <InputField
            itemName="category"
            type="text"
            value={formData.category}
            onChange={onInputChange}
            text="Category"
          />
  
          <InputField
            itemName="price"
            type="number"
            value={formData.price}
            onChange={onInputChange}
            text="Price of Item"
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
  export default MenuModal;