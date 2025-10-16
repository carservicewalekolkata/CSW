interface VehicleSelectionInputProps {
  label: string;
  placeholder: string;
  value: string;
  onOpen: () => void;
  isComplete: boolean;
  onClear?: () => void;
}

const VehicleSelectionInput = ({
  label,
  placeholder,
  value,
  onOpen,
  isComplete,
  onClear
}: VehicleSelectionInputProps) => (
  <label className="relative block">
    <span className="absolute -top-3 left-4 bg-white px-1 text-[13px] font-semibold text-[#2a1454]">{label}</span>
    <input
      type="text"
      value={value}
      readOnly
      placeholder={placeholder}
      onFocus={onOpen}
      onClick={(event) => {
        event.preventDefault();
        onOpen();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      className={`w-full rounded-md border bg-white p-4 text-sm text-[#2a1454] placeholder:text-[#9aa6c2] transition focus:border-[#0285CE] focus:outline-none focus:ring-4 focus:ring-[#D6F0FF] ${
        value && onClear ? 'pr-12' : 'pr-4'
      } ${isComplete ? 'border-[#0285CE] font-semibold' : 'border-[#00AEEF]'}`}
    />
    {value && onClear && (
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onClear();
        }}
        className="absolute inset-y-0 right-4 flex items-center text-lg text-[#9aa6c2] transition hover:text-[#0285CE]"
        aria-label="Clear vehicle selection"
      >
        &times;
      </button>
    )}
  </label>
);

export default VehicleSelectionInput;
