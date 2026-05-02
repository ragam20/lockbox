import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { RadioGroup, RadioGroupItem } from "../radio-group";

const sortMap = {
  newest: { field: "created_at", desc: true },
  oldest: { field: "created_at", asc: false },
  "a-z": { field: "title", desc: true },
  "z-a": { field: "title", asc: false },
} as const;

type SortValue = keyof typeof sortMap;

type filter = {
  title: string;
  value: SortValue;
};

const filterMenu: filter[] = [
  { title: "Terbaru", value: "newest" },
  { title: "Terlama", value: "oldest" },
  { title: "A-Z", value: "a-z" },
  { title: "Z-A", value: "z-a" },
];

export function getSortQuery(sort: SortValue) {
  return sortMap[sort];
}

type vaultFilterProps = {
  value: (v: SortValue) => void;
  children: React.ReactNode;
};

export const VaultFilter = ({ value, children }: vaultFilterProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-fit">
        <RadioGroup defaultValue={filterMenu[0].value} onValueChange={value}>
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
