import { ChangeEvent, memo } from 'react';

export interface AccentFormFieldProps {
  label: string;
  type: 'text' | 'tel';
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AccentFormField = memo(({ label, type, value, placeholder, onChange }: AccentFormFieldProps) => (
  <label className="relative block">
    {/* Floating label */}
    <span className="absolute -top-3 left-4 bg-white px-1 text-[13px] font-semibold text-[#2a1454]">
      {label}
    </span>

    {/* Input */}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-[#00AEEF] bg-white p-4 text-sm text-[#2a1454] placeholder:text-[#9aa6c2] focus:border-[#0285CE] focus:outline-none focus:ring-4 focus:ring-[#D6F0FF] transition-all"
    />
  </label>
));

AccentFormField.displayName = 'AccentFormField';

export default AccentFormField;
