import PropTypes from "prop-types";
// material
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { Icon } from "@iconify/react";

import React from "react";
import roundFilterList from "@iconify/icons-ic/round-filter-list";

// ----------------------------------------------------------------------

VideoSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
};

export default function VideoSort({ options, option, setOption }) {
  async function handleChange(event) {
    const chosen_ = options.find((item) => item.id === event.target.value);
    // console.log(chosen_);
    return chosen_
      ? setOption(chosen_)
      : setOption({
          label: "All",
          value: "All",
          id: "UU6vGZzgXNNQppWNKgIQCjag",
        });
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Tooltip title="Filter list">
        <Icon icon={roundFilterList} fontSize={25} />
      </Tooltip>
      Filter&nbsp;&nbsp; 
      <FormControl style={{ padding: "0" }}>
        <Select
          labelId="demo-customized-select-label"
          id="demo-customized-select"
          value={option.id}
          onChange={handleChange}
        >
          {/* <MenuItem value="UU6vGZzgXNNQppWNKgIQCjag">All</MenuItem> */}
          {options.map((option) => {
            return (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
