import React from 'react';
import './InputField.css';

const InputField = ({ value, onChange, itemName, type = "text", placeholder, text }) => {
  return (
    <div className="input-field-container">
      <label htmlFor={itemName} className="input-label">{text}</label>
      <input
        id={itemName}
        className="input-box"
        type={type}
        value={value || ''}
        onChange={(e) => onChange(itemName, e)}
        placeholder={placeholder}
        step="0.01"
      />
    </div>
  );
};

export default InputField;

