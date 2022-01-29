import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import homeFill from "@iconify/icons-eva/home-fill";
import personFill from "@iconify/icons-eva/person-fill";
import settings2Fill from "@iconify/icons-eva/settings-2-fill";
import { Link as RouterLink } from "react-router-dom";
// material
import { alpha } from "@material-ui/core/styles";
import {
  Button,
  Box,
  Divider,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
} from "@material-ui/core";
// components
import MenuPopover from "../../components/MenuPopover";
//

// ----------------------------------------------------------------------
import { useAuth } from "src/authentication/AuthContext";

const MENU_OPTIONS = [
  {
    label: "Home",
    icon: homeFill,
    linkTo: "/",
  },
  {
    label: "Profile",
    icon: personFill,
    linkTo: "/dashboard/profile",
  },
  // {
  //   label: "Settings",
  //   icon: settings2Fill,
  //   linkTo: "#",
  // },
];

// ----------------------------------------------------------------------
import { useNavigate } from "react-router-dom";
export default function AccountPopover() {
  const navigate = useNavigate();
  const {
    user_logout,
    displayErrMess,
    setLoading,
    currentUser,
    userProfile,
    waitUser,
  } = useAuth();
  const account = {
    displayName:
      !waitUser && userProfile
        ? userProfile.displayName
        : currentUser.displayName,
    email: currentUser.email,
    photoURL: "/static/mock-images/avatars/avatar_default.jpg",
  };
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await user_logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.log("err logout", err);
      displayErrMess("Fail to logout! please try again", "error");
    }
  };

  return (
    <>
        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button
            fullWidth
            color="primary"
            variant="outlined"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
    </>
  );
}
