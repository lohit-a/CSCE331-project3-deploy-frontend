import './MenuPage.css';
import InputField from '../../components/InputField/InputField';
import MenuModal from '../../components/MenuModal/MenuModal';
import React, { useEffect, useState } from 'react';



function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [addQuantities, setAddQuantities] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState();
  const [modalMode, setModalMode] = useState('add');
  

  useEffect(() => {
    fetchMenu();
  }, [])

  const fetchMenu = async () => {
    try {
        const response = await fetch('http://localhost:8081/menu_items'); // https://proj3-t62-backenddeploy-production.up.railway.app/
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
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.item_name}"?`);
    if (!confirmDelete) return;
  
    fetch(`http://localhost:8081/menu_items/${item.menu_item_id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete item');
        }
        // Remove item from local state
        setMenu((prev) =>
          prev.filter((menuItem) => menuItem.menu_item_id !== item.menu_item_id)
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
          <h1>Manage Menu</h1>
        </div>
        <div className='menu-body'>
          <table className="menu-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>#</th>
                <th >Item Name</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, index) => {
                return (
                  <tr key={item.menu_item_id} className="menu-row">
                    <td>{index + 1}</td> {/* ✅ Show the row number, starting from 1 */}
                    <td>{item.item_name}</td>
                    <td>{item.category}</td>
                    <td>{item.price}</td>
                    
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

export default MenuPage;