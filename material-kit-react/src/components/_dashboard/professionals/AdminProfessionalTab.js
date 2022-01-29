import { Icon } from "@iconify/react";
import { alpha, experimentalStyled as styled } from "@material-ui/core/styles";
import { Card, Typography, IconButton } from "@material-ui/core";
// ----------------------------------------------------------------------

export default function ProfessionalsTab({
  name,
  color,
  icon,
  func,
  chosen,
  admin_tbl,
}) {
  const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: "none",
    textAlign: "center",
    padding: theme.spacing(2, 0),
    color: getRootColor(theme, color),
    // boderStyle: "5px solid",
    // borderColor: "#92a8d1",
    border: chosen ? "4px solid #92a8d1" : "none",
    backgroundColor: getRootBackgroundColor(theme, color),
  }));

  const IconWrapperStyle = styled("div")(({ theme }) => ({
    margin: "auto",
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: "center",
    marginBottom: theme.spacing(3),
    color: getIconWraperColor(theme, color),
    backgroundImage: getIconWraperBackgroundColor(theme, color),
  }));

  return (
    <RootStyle>
      <IconWrapperStyle>
        <IconButton>
          <Icon
            icon={icon}
            width={24}
            height={24}
            onClick={() => func(admin_tbl)}
          />
        </IconButton>
      </IconWrapperStyle>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {name}
      </Typography>
    </RootStyle>
  );
}

// utils function
function getRootColor(theme, color) {
  if (color === 0) return theme.palette.primary.darker;
  if (color === 1) return theme.palette.warning.darker;
  if (color === 2) return theme.palette.info.darker;
}

function getRootBackgroundColor(theme, color) {
  if (color === 0) return theme.palette.primary.lighter;
  if (color === 1) return theme.palette.warning.lighter;
  if (color === 2) return theme.palette.info.lighter;
}

function getIconWraperColor(theme, color) {
  if (color === 0) return theme.palette.primary.dark;
  if (color === 1) return theme.palette.warning.dark;
  if (color === 2) return theme.palette.info.dark;
}

function getIconWraperBackgroundColor(theme, color) {
  if (color === 0)
    return `linear-gradient(135deg, ${alpha(
      theme.palette.primary.dark,
      0
    )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`;
  if (color === 1)
    return `linear-gradient(135deg, ${alpha(
      theme.palette.warning.dark,
      0
    )} 0%, ${alpha(theme.palette.warning.dark, 0.24)} 100%)`;
  if (color === 2)
    return `linear-gradient(135deg, ${alpha(
      theme.palette.info.dark,
      0
    )} 0%, ${alpha(theme.palette.info.dark, 0.24)} 100%)`;
}
