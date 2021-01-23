import * as React from "react";
import { FieldSelect, SelectOptionProps } from "@looker/components";
import { ILookmlModelExploreField } from "@looker/sdk";

interface CohortFieldPickerProps {
  field: ILookmlModelExploreField;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const CohortFieldPicker: React.FC<CohortFieldPickerProps> = ({
  field,
  label,
  onChange,
  value,
}) => {
  if (!field) {
    return null;
  }

  const options: SelectOptionProps[] = field.enumerations
    ? field.enumerations.map((enumeration) => {
        return {
          label: enumeration.label || "",
          value: enumeration.value || "",
        };
      })
    : [];

  return (
    <FieldSelect
      value={value}
      label={label}
      options={options}
      placeholder={`Select a ${label.toLowerCase()}`}
      onChange={onChange}
    />
  );
};

export default CohortFieldPicker;
