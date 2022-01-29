import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
// material
import { experimentalStyled as styled } from "@material-ui/core/styles";
import searchFill from "@iconify/icons-eva/search-fill";

import { Box, OutlinedInput, InputAdornment, Button } from "@material-ui/core";
// ----------------------------------------------------------------------
import { getVideoInPlaylist } from "src/google-drive-api/database";
import { useAuth } from "src/authentication/AuthContext";

const RootStyle = styled("div")(({ theme }) => ({
  "& .MuiAutocomplete-root": {
    width: 200,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
    "&.Mui-focused": {
      width: 240,
      "& .MuiAutocomplete-inputRoot": {
        boxShadow: theme.customShadows.z12,
      },
    },
  },
  "& .MuiAutocomplete-inputRoot": {
    "& fieldset": {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`,
    },
  },
  "& .MuiAutocomplete-option": {
    "&:not(:last-child)": {
      borderBottom: `solid 1px ${theme.palette.divider}`,
    },
  },
}));

export default function VideoSearchBox({ searchKey, onSearchKey }) {
  function getChangeValue(event) {
    onSearchKey(event.target.value);
  }

  return (
    <RootStyle>
      <SearchStyle
        style={{ paddingleft: 0 }}
        value={searchKey}
        onChange={getChangeValue}
        // onKeyUp={searchVideos}
        placeholder="Search video..."
        startAdornment={
          <InputAdornment position="start">
            <Box
              component={Icon}
              icon={searchFill}
              sx={{ color: "text.disabled" }}
            />
          </InputAdornment>
        }
      />
    </RootStyle>
  );
}

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  height: 49.99,
  "&.Mui-focused": { width: 300, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));
