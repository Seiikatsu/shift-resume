export type SearchableSelectOption<VALUE extends string> = {
  value: VALUE;
  label: string;
};

export type SearchableSelectProps<VALUES extends string> = {
  name?: string;
  value?: VALUES;
  options: SearchableSelectOption<VALUES>[];
  onChange?: (value: VALUES) => void;
  placeholder?: string;
  searchPlaceholder?: string;
};
