import React, { useState, useEffect } from 'react';
import './MenuModal.css';
import InputField from '../InputField/InputField';
import { SERVER_URL } from '../../constant';

const MenuModal = ({handleSave, isOpen, setOpenModal, item = null, mode = 'add'}) => {
  
    console.log(item)
    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
        price: '',
        // components: [],
      });

    // const [inventoryItems, setInventoryItems] = useState([]);
    // useEffect(() => {
    //     fetch(`${SERVER_URL}/inventory`)
    //       .then(res => res.json())
    //       .then(data => setInventoryItems(data))
    //       .catch(console.error);
    // }, []);

    // const handleComponentChange = (index, field, value) => {
    //     setFormData(prev => {
    //         const newComponents = [...prev.components];
    //         newComponents[index] = {
    //         ...newComponents[index],
    //         [field]: value,
    //         };
    //         return { ...prev, components: newComponents };
    //     });
    // };
      
    // const addComponent = () => {
    //     setFormData(prev => ({
    //         ...prev,
    //         components: [...prev.components, { inventoryItemId: '', quantity: '' }],
    //     }));
    // };
      
    // const removeComponent = (index) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         components: prev.components.filter((_, i) => i !== index),
    //     }));
    // };

    useEffect(() => {
      if (mode === 'edit' && item) {
        setFormData({
            itemName: item.itemName,
            category: item.category,
            price: item.price,
            // components: item.components.map(c => ({
            //   inventoryItemId: c.getInventoryItemId(),
            //   quantity: c.getQuantity(),
            // })),
        });
      }
      else{
        setFormData({
            itemName: '',
            category: '',
            price: '',
            // components: [],
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
        const payload = {
            itemName: formData.itemName,
            category: formData.category,
            price: roundDec(formData.price),
            // components: formData.components.map(c => ({
            //   inventoryItemId: parseInt(c.inventoryItemId, 10),
            //   quantity: parseFloat(c.quantity),
            // })),
        };

        const url =
        mode === 'edit'
            ? `${SERVER_URL}/menu_items/${item.menuItemId}`
            : `${SERVER_URL}/menu_items`;

      const method = mode === 'edit' ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
            <h1>{mode === 'edit' ? `Edit: ${formData.itemName}` : 'Add Menu Item'}</h1>
           
            <div className='modal-content-body'>
                <InputField
                    itemName="itemName"
                    type="text"
                    value={formData.itemName}
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

                {/* <h2>Components</h2>
                {formData.components.map((comp, idx) => (
                <div key={idx} className="component-row">
                    <select
                        value={comp.inventoryItemId}
                        onChange={e => handleComponentChange(idx, 'inventoryItemId', e.target.value)}
                    >
                        <option value="">-- Select Ingredient --</option>
                        {inventoryItems.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>

                    <InputField
                        itemName={`quantity-${idx}`}
                        type="number"
                        value={comp.quantity}
                        onChange={e => handleComponentChange(idx, 'quantity', e.target.value)}
                        text="Quantity"
                    />
                    <button type="button" onClick={() => removeComponent(idx)}>Remove</button>
                </div>
                ))}
                <button type="button" onClick={addComponent}>Add Component</button> */}
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