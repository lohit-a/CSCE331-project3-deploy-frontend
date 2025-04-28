import React, { useState, useEffect } from 'react';
import InputField from '../InputField/InputField';
import { SERVER_URL } from '../../constant';

const UserModal = ({ handleSave, isOpen, setOpenModal, user = null, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'ROLE_CUSTOMER',
    source: 'GOOGLE'
  });

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData(user);
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        role: 'ROLE_CUSTOMER',
        source: 'GOOGLE'
      });
    }
  }, [user, mode]);

  const onInputChange = (field, event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    const url =
      mode === 'edit'
        ? SERVER_URL + `/users/${user.userId}`
        : SERVER_URL + '/users';

    const method = mode === 'edit' ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save user');
        return res.json();
      })
      .then(data => {
        handleSave(data);
        setOpenModal(false);
      })
      .catch(console.error);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h1>{mode === 'edit' ? `Edit: ${formData.firstName} ${formData.lastName}` : 'Add User'}</h1>

        <div className="modal-content-body">
          <InputField
            itemName="firstName"
            type="text"
            value={formData.firstName}
            onChange={onInputChange}
            text="First Name"
          />

          <InputField
            itemName="lastName"
            type="text"
            value={formData.lastName}
            onChange={onInputChange}
            text="Last Name"
          />

          <InputField
            itemName="email"
            type="email"
            value={formData.email}
            onChange={onInputChange}
            text="Email"
          />

          <label>Role</label>
          <select
            value={formData.role}
            onChange={e => onInputChange('role', e)}
            className="input-select"
          >
            <option value="ROLE_CASHIER">Cashier</option>
            <option value="ROLE_MANAGER">Manager</option>
            <option value="ROLE_CUSTOMER">Customer</option>
          </select>

          {/* <label>Source</label>
          <select
            value={formData.source}
            onChange={e => onInputChange('source', e)}
            className="input-select"
          >
            <option value="LOCAL">Local</option>
            <option value="GOOGLE">Google</option>
            <option value="GITHUB">GitHub</option>
          </select> */}
        </div>

        <button onClick={handleSubmit}>SAVE</button>
        <button onClick={() => {
          setFormData(user);
          setOpenModal(false);
        }}>
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default UserModal;