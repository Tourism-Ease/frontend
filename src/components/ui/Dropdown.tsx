// components/ui/Dropdown.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Array<{ id: string; name: string; [key: string]: any }>;
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
}

export function Dropdown({
  value,
  onValueChange,
  options,
  placeholder,
  disabled = false,
  loading = false,
}: DropdownProps) {
  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}