import { ChangeEvent, memo } from 'react';

export interface AccentFormFieldProps {
  label: string;
  type: 'text' | 'tel';
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AccentFormField = memo(({ label, type, value, placeholder, onChange }: AccentFormFieldProps) => (
  <label className="block text-sm text-[#2a1454]">
    <span className="flex items-center gap-3 font-semibold">
      <span className="inline-flex h-2 w-2 rounded-full bg-[#EA4A95]" />
      {label}
      <span className="h-px flex-1 bg-[#C2CCE2]" />
    </span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-3 w-full rounded-xl border border-[#00AEEF] bg-white px-4 py-2.5 text-sm text-[#2a1454] placeholder:text-[#9aa6c2] focus:border-[#0285CE] focus:outline-none focus:ring-4 focus:ring-[#D6F0FF]"
    />
  </label>
));

AccentFormField.displayName = 'AccentFormField';

export default AccentFormField;
