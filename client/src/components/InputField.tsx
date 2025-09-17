// client/src/components/InputField.tsx
import React from 'react';

interface Props {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const InputField: React.FC<Props> = ({ label, type = 'text', value, onChange, error, required }) => {
  return (
    <div className="form-group">
      <label>{label}:</label>
      <input type={type} value={value} onChange={onChange} required={required} />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default InputField;
