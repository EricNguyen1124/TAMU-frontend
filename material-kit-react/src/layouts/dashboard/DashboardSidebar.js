import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
// material
import { experimentalStyled as styled } from "@material-ui/core/styles";
import {
  Box,
  Link,
  Button,
  Drawer,
  Typography,
  Avatar,
  Stack,
} from "@material-ui/core";
// components
import Logo from "../../components/Logo";
import Scrollbar from "../../components/Scrollbar";
import NavSection from "../../components/NavSection";
import { MHidden } from "../../components/@material-extend";
//
import { sidebarConfig, adminConfig } from "./SidebarConfig";
import { useAuth } from "src/authentication/AuthContext";
// import account from "../../_mocks_/account";
import LogoutButton from "./LogoutButton";
import {
  getCountLinkedin,
  getCountMock,
  getCountResume,
} from "src/mysql_db_api/members";
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const [resumeCount, setResumeCount] = useState(0);
  const [mockCount, setMockCount] = useState(0);
  const [linkedinCount, setLinkedinCount] = useState(0);

  const { pathname } = useLocation();
  const { currentUser, userProfile, waitUser, isSuperAdmin, isPD } = useAuth();
  const account = {
    displayName:
      !waitUser && userProfile
        ? userProfile.displayName
        : currentUser.displayName,
    email: currentUser.email,
    photoURL: "/static/mock-images/avatars/avatar_default.jpg",
  };
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(async () => {
    countProfessionals();
  }, [countProfessionals]);

  async function countProfessionals() {
    const promise = getCountLinkedin(userProfile.psid);
    const promise1 = getCountMock(userProfile.psid);
    const promise2 = getCountResume(userProfile.psid);
    const [res, res1, res2] = await Promise.all([promise, promise1, promise2]);
    if ((res.data, res1.data, res2.data)) {
      setResumeCount(res2.data[0].resume);
      setMockCount(res1.data[0].mock_interview);
      setLinkedinCount(res.data[0].linkedin);
      // console.log(res.data[0].linkedin);
    }
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/">
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
                {account.displayName}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} adminConfig={adminConfig} />

      <Box sx={{ flexGrow: 1, paddingLeft: "30px", paddingTop: "15px" }}>
        {(isSuperAdmin() || isPD()) && (
          <Typography color="primary" variant="subtitle2" size="small">
            <span>Resume: {resumeCount} | </span>
            <span>Interview: {mockCount} | </span>
            <span>Linkedin: {linkedinCount} </span>
          </Typography>
        )}
      </Box>

      {/* <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'grey.200'
          }}
        >
          <Box
            component="img"
            src="/static/illustrations/illustration_rocket.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Get more?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $69
            </Typography>
          </Box>

          <Button
            fullWidth
            href="https://material-ui.com/store/items/minimal-dashboard/"
            target="_blank"
            variant="contained"
          >
            Upgrade to Pro
          </Button>
        </Stack>
      </Box> */}
      <LogoutButton />
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: "background.default",
            },
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
