import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  width = "w-64",
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm ${width} focus:outline-none focus:ring-2 focus:ring-gray-100 bg-white`}
      />
    </div>
  );
}
