import React from "react";
import { Dropdown } from "semantic-ui-react";
import { onlyUnique } from "../../Utilities/utils";
import { FilterField } from "../data-types";
import styles from "./EventFilter.module.css";

interface Props {
  field: FilterField;
  options: string[];
  // I don't want this managing state independently
  selected: string[];
  // output of this component to parent
  filterChange: (newVal: string[]) => void;
}

const DISPLAY_FILT_FIELD: { [key in FilterField]: string } = {
  city: "Where",
  dayOfWeek: "When",
  inPerson: "In Person?",
  style: "Style",
};

export default function EventFilter({
  field,
  options,
  selected,
  filterChange,
}: Props) {
  let optionsToShow = options;
  if (field === "dayOfWeek")
    optionsToShow = [
      "Mondays",
      "Tuesdays",
      "Wednesdays",
      "Thursdays",
      "Fridays",
      "Saturdays",
      "Sundays",
    ]
      .concat(optionsToShow)
      .filter(onlyUnique);

  return (
    <Dropdown
      id={styles["EventFilter-Dropdown"]}
      placeholder={DISPLAY_FILT_FIELD[field]}
      fluid
      selection
      multiple
      clearable
      // After getting all the values, mung it to the type that the dropdown value wants
      options={optionsToShow.map((o, i) => ({ key: i, text: o, value: o }))}
      value={selected}
      onChange={(event, data) => {
        console.log(data.value);
        filterChange(data.value as string[]);
      }}
    ></Dropdown>
  );
}
