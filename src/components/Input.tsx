function Input({
  type,
  value,
  onChange,
  placeholder,
}: {
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  return (
    <input
      className="w-32 px-2 py-1 rounded-xl text-center text-white text-lg bg-secondary border focus:outline-none focus:ring-2 focus:border-accent"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}

export default Input;
