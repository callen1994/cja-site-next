import React from "react";
import { FilterField } from "../data-types";
import styles from "./EventFilter.module.css";

interface Props {
  field: FilterField;
  options: string[];
  // I don't want this managing state independently
  selected: string;
  // output of this component to parent
  filterChange: (newVal: string) => void;
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
  return (
    <div className={styles["body-el"]}>
      <span>{DISPLAY_FILT_FIELD[field]}</span>
      <select
        onChange={(e) => filterChange(e.target.value)}
        value={selected || ""}
      >
        {(options.concat("") || []).map((o, i) => (
          <option key={i} value={o}>
            {o || "No Filter"}
          </option>
        ))}
      </select>
    </div>
  );
}