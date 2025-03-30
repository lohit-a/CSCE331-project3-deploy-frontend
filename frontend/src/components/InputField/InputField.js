import React from 'react';
import './InputField.css';

const InputField = ({ value, onChange, itemName, type = "text", placeholder, text }) => {
  return (
    <div>
    <h3>{text}</h3>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(itemName, e)}
      placeholder={placeholder}
    />
    </div>
    
  );
};

export default InputField;