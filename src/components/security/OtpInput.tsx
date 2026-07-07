import React, { useRef } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('');

  const handleChange = (index: number, digit: string) => {
    if (!/^[0-9]?$/.test(digit)) return;
    const next = value.split('');
    next[index] = digit;
    const joined = next.join('').slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          value={digits[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          maxLength={1}
          inputMode="numeric"
          className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
        />
      ))}
    </div>
  );
};
