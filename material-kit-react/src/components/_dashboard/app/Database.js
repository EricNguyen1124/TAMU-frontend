import { Icon } from "@iconify/react";
import databaseIcon from "@iconify-icons/feather/database";
// material
import { alpha, experimentalStyled as styled } from "@material-ui/core/styles";
import { Card, Typography, IconButton } from "@material-ui/core";
// utils

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter,
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
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.dark,
    0
  )} 0%, ${alpha(theme.palette.primary.dark, 0.24)} 100%)`,
}));
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------
const DATABASE_ROOT = process.env.REACT_APP_DATABASE_ROOT;

const DATABASE_INFO = {
  folderId: DATABASE_ROOT,
  name: "Database",
};

const db_name = process.env.REACT_APP_DB_NAME;
const db_linkedin = process.env.REACT_APP_DB_LINKEDIN;
const db_email = process.env.REACT_APP_DB_EMAIL;
const db_groupme = process.env.REACT_APP_DB_GROUPME;

function openLinkedIn() {
  window.open(db_linkedin, "_blank");
}

function openGroupme() {
  window.open(db_groupme, "_blank");
}

function openEmail() {
  window.open(db_email);
}

export default function Database() {
  const history = useNavigate();
  const gotoDatabase = () => {
    history(
      `/dashboard/database/${DATABASE_INFO.folderId}/${DATABASE_INFO.name}`
    );
  };

  return (
    <RootStyle>
      <IconWrapperStyle>
        <IconButton>
          <Icon
            icon={databaseIcon}
            width={24}
            height={24}
            onClick={gotoDatabase}
          />
        </IconButton>
      </IconWrapperStyle>
      {/* <Typography variant="h3">{fShortenNumber(TOTAL)}</Typography> */}
      <Typography
        variant="subtitle2"
        sx={{ opacity: 0.72 }}
        onClick={gotoDatabase}
      >
        Database Materials
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {db_name}
      </Typography>
      <Icon
        icon="carbon:logo-linkedin"
        onClick={openLinkedIn}
        cursor={"pointer"}
        fontSize={"25px"}
      />
      <Icon
        icon="ic:baseline-email"
        onClick={openEmail}
        cursor={"pointer"}
        fontSize={"25px"}
      />
      <Icon
        icon="simple-icons:groupme"
        onClick={openGroupme}
        cursor={"pointer"}
        fontSize={"22px"}
      />
    </RootStyle>
  );
}
