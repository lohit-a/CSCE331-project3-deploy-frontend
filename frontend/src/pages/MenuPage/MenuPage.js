import './MenuPage.css';
import InputField from '../../components/InputField/InputField';
import MenuModal from '../../components/MenuModal/MenuModal';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../constant';



function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [addQuantities, setAddQuantities] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState();
  const [modalMode, setModalMode] = useState('add');
  const [inventoryMap, setInventoryMap] = useState({});

  useEffect(() => {
    fetch(SERVER_URL + `/inventory`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(items => {
        const map = {};
        items.forEach(inv => {
          map[inv.inventoryItemId] = inv.itemName;
        });
        setInventoryMap(map);
      })
      .catch(err => console.error("Error loading inventory:", err));
  }, []);


  useEffect(() => {
    fetchMenu();
  }, [])

  const fetchMenu = async () => {
    try {
        const response = await fetch(SERVER_URL + `/menu_items`, {
                                      method: 'GET',
                                      credentials: 'include'
                                    })
        const data = await response.json();
        setMenu(data);
    } catch (error) {
        console.error('Error fetching menu:', error);
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
  

    fetch(`${SERVER_URL}/menu_items/${item.menuItemId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete item');
        }
        // Remove item from local state
        setMenu((prev) =>
          prev.filter((menuItem) => menuItem.menuItemId !== item.menuItemId)
        );
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
        alert('Failed to delete item.');
      });
  };

  const handleSave = (item) => {
    fetchMenu();
  };

  return (
    <div className="menu-page">
    <MenuModal
      isOpen={openModal}
      setOpenModal={setOpenModal}
      handleSave={handleSave}
      item={editItem}
      mode={modalMode}
    />
      <div className="menu-container">
        <div className='menu-header'>
          <h1 className="menu-title">Manage Menu</h1>
          <div className='button-group'>
            <button
                className="btn btn-add"
                onClick={() => {
                  setEditItem(null);
                  setModalMode('add');
                  setOpenModal(true);
                }}
              >
                Add Menu Item
              </button>
          </div>
        </div>
        <div className='menu-body'>
          <table className="menu-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th >Item Name</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Components</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, index) => {
                return (
                  <tr key={item.menuItemId} className="menu-row">
                    <td>{index + 1}</td> {/* ✅ Show the row number, starting from 1 */}
                    <td>{item.itemName}</td>
                    <td>{item.category}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.components && item.components.length > 0 ? (
                        <ul className="components-list">
                          {item.components.map(comp => {
                            const name = inventoryMap[comp.inventoryItemId];
                            return (
                              <li key={comp.id}>
                                {name || `#${comp.inventoryItemId}`}: {comp.quantity}
                              </li>
                            );
                          })}
                        </ul>
                        ) : (
                        <em>—</em>
                      )}
                    </td>
                    
                    <td>
                        <div>
                            {/* <button
                                className="btn btn-add"
                                onClick={() => {
                                setEditItem(item);
                                setOpenModal(true);
                                setModalMode('add');
                                }}
                            >
                                Add
                            </button> */}

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

export default MenuPage;