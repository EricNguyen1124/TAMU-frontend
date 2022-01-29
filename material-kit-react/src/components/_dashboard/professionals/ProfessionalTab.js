import { Icon } from "@iconify/react";
import { alpha, experimentalStyled as styled } from "@material-ui/core/styles";
import { Card, Typography, IconButton } from "@material-ui/core";
import { useState } from "react";
import {
  ConfirmDiaglog,
  AddiInforDialog,
} from "src/components/_dashboard/professionals";
import { useAuth } from "src/authentication/AuthContext";
// ----------------------------------------------------------------------
const schedule_pd_link = process.env.REACT_APP_PD_SHEDULE_LINK;

export default function ProfessionalsTab({
  name,
  signUpFunc,
  color,
  icon,
  canSignup,
}) {
  const RootStyle = styled(Card)(({ theme }) => ({
    boxShadow: "none",
    textAlign: "center",
    padding: theme.spacing(5, 0),
    color: getRootColor(theme, color),
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
  const { displayErrMess } = useAuth();
  const getErrMess = () => {
    if (name == "Mock Interview")
      return "Cannot sign up to the mock interview at this time";
    if (name == "Resume Review")
      return "Cannot sign up for Resume Review because you do not have resume uploaded. Please go to My Profile tab and upload your resume!";
    if (name == "Linkedin Review")
      return "Cannot sign up for Linkedin Review because your LinkedIn link is not correct or has not been added. Please go to My Profile tab and add your LinkedIn!";
  };
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAddiInfo, setOpenAddiInfo] = useState(false);
  const handleOpenDiaglog = () => {
    return canSignup
      ? setOpenConfirm(true)
      : displayErrMess(getErrMess(), "warning");
  };
  return (
    <RootStyle>
      <IconWrapperStyle>
        <IconButton>
          <Icon
            icon={icon}
            width={24}
            height={24}
            onClick={handleOpenDiaglog}
          />
        </IconButton>
      </IconWrapperStyle>
      <Typography
        variant="subtitle2"
        sx={{ opacity: 0.72 }}
        // onClick={gotoDatabase}
      >
        {name}
      </Typography>
      <ConfirmDiaglog
        open={openConfirm}
        setOpen={setOpenConfirm}
        event_name={name}
        exc_func={signUpFunc}
        setOpenAddiIfor={setOpenAddiInfo}
      />
      <AddiInforDialog
        open={openAddiInfo}
        setOpen={setOpenAddiInfo}
        event_name={name}
        redirect_link={schedule_pd_link}
      />
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
