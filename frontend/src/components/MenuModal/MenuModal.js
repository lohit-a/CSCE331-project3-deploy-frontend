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
        components: []
      });

    const [inventoryList, setInventoryList] = useState([]);
    useEffect(() => {
      fetch(`${SERVER_URL}/inventory`, {
        method: 'GET',
        credentials: 'include'
      })
        .then(res => res.json())
        .then(data => setInventoryList(data))
        .catch(console.error);
    }, []);

    useEffect(() => {
      if (mode === 'edit' && item) {
        setFormData({
          itemName: item.itemName,
          category: item.category,
          price: item.price,
          components: item.components || []
        });
      } else {
        setFormData({ itemName: '', category: '', price: '', components: [] });
      }
    }, [item, mode]);
  
    const onInputChange = (field, event) => {
        const value = event.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleComponentChange = (index, field, value) => {
      setFormData(prev => {
        const comps = [...prev.components];
        comps[index] = {
          ...comps[index],
          [field]: field === 'quantity' ? parseFloat(value) : parseInt(value, 10)
        };
        return { ...prev, components: comps };
      });
    };

    const addComponent = () => {
      setFormData(prev => ({
        ...prev,
        components: [...prev.components, { inventoryItemId: '', quantity: 1 }]
      }));
    };

    const removeComponent = index => {
      setFormData(prev => {
        const comps = prev.components.filter((_, i) => i !== index);
        return { ...prev, components: comps };
      });
    };

    const roundDec = (num) => parseFloat(parseFloat(num).toFixed(2));
    
    const handleSubmit = () => {
        const payload = {
            itemName: formData.itemName,
            category: formData.category,
            price: roundDec(formData.price),
            components: formData.components.map(c => ({
              inventoryItemId: c.inventoryItemId,
              quantity: c.quantity
            }))
        };

        const url =
        mode === 'edit'
            ? `${SERVER_URL}/menu_items/${item.menuItemId}`
            : `${SERVER_URL}/menu_items`;

      const method = mode === 'edit' ? 'PUT' : 'POST';

      fetch(url, {
        method,                       
        credentials: 'include',       
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to save item');
          return res.json();
        })
        .then(savedItem => {
          // **Step 2**: call your handleSave(savedItem) callback here
          handleSave(savedItem);
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



                <div className='components-section'>
                  <h4>Components</h4>
                  {formData.components.map((comp, idx) => (
                    <div key={idx} className='component-row'>
                      <select
                        value={comp.inventoryItemId}
                        onChange={e => handleComponentChange(idx, 'inventoryItemId', e.target.value)}
                      >
                        <option value=''>— choose —</option>
                        {inventoryList.map(inv => (
                          <option
                            key={inv.inventoryItemId}
                            value={inv.inventoryItemId}
                          >
                            {inv.itemName}
                          </option>
                        ))}
                      </select>

                      <input
                        type='number'
                        min='1'
                        value={comp.quantity}
                        onChange={e => handleComponentChange(idx, 'quantity', e.target.value)}
                        style={{ width: '60px', marginLeft: '8px' }}
                      />

                      <button
                        type='button'
                        onClick={() => removeComponent(idx)}
                        style={{
                          marginLeft: '2px',
                          padding: '2px 6px',
                          height: '24px',
                          lineHeight: '1',
                          fontSize: '0.8rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type='button'
                    onClick={addComponent}
                    style={{ marginTop: '8px' }}
                  >
                    Add Component
                  </button>
                </div>



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