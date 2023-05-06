import React from 'react';

const inputStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '28px',
  height: '52px',
  maxWidth: '42px',
  color: 'white',
  background: '#26262C',
  borderBottom: '1px solid #4CEEF9',
};

interface SeminarInputProps {
  disabled?: boolean;
  helperText?: string;
}
const SeminarInput = ({ disabled, helperText }: SeminarInputProps) => {
  const inputListKey = [0, 1, 2, 3];
  return (
    <div>
      <div className="flex h-[52px] w-[192px] justify-between">
        {inputListKey.map((key) => {
          return <input key={key} style={inputStyle} maxLength={1} disabled={disabled} />;
        })}
      </div>
      <div className="my-[4px] flex items-center justify-center text-small text-red-500">{helperText}</div>
    </div>
  );
};

export default SeminarInput;
