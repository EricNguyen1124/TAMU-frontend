import PropTypes from "prop-types";
// material
import { Box } from "@material-ui/core";

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object,
};

export default function Logo({ sx }) {
  return (
    <Box
      component="img"
      src="/static/Logo.png"
      sx={{ width: 122, height: 120, marginLeft: 'auto', marginRight: 'auto', ...sx }}
    />
  );
}
