import { filterMenu, type SortValue } from "@/types/params";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { RadioGroup, RadioGroupItem } from "../radio-group";

type vaultFilterProps = {
  value: SortValue;
  onValueChange: (v: SortValue) => void;
  children: React.ReactNode;
};

export const VaultFilter = ({ value, onValueChange, children }: vaultFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-fit">
        <RadioGroup value={value} onValueChange={(nextValue) => onValueChange(nextValue as SortValue)}>
          {filterMenu.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <RadioGroupItem value={item.value} id={item.title} />
              <Label htmlFor={item.title}>{item.title}</Label>
            </div>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};
