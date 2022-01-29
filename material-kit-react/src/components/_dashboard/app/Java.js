import { Icon } from "@iconify/react";
import javaIcon from "@iconify-icons/fontisto/java";
// material
import { alpha, experimentalStyled as styled } from "@material-ui/core/styles";
import { Card, IconButton, Typography } from "@material-ui/core";
// utils

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: "none",
  textAlign: "center",
  padding: theme.spacing(5, 0),
  color: theme.palette.info.darker,
  backgroundColor: theme.palette.info.lighter,
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
  color: theme.palette.info.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(
    theme.palette.info.dark,
    0
  )} 0%, ${alpha(theme.palette.info.dark, 0.24)} 100%)`,
}));
import { useNavigate } from "react-router-dom";
// ----------------------------------------------------------------------

const JAVA_INFO = {
  folderId: process.env.REACT_APP_JAVA_ROOT,
  name: "Java",
};

const java_name = process.env.REACT_APP_JAVA_NAME;
const java_linkedin = process.env.REACT_APP_JAVA_LINKEDIN;
const java_email = process.env.REACT_APP_JAVA_EMAIL;
const java_groupme = process.env.REACT_APP_JAVA_GROUPME;

function openLinkedIn() {
  window.open(java_linkedin, "_blank");
}

function openGroupme() {
  window.open(java_groupme, "_blank");
}

function openEmail() {
  window.open(java_email);
}

export default function Java() {
  const history = useNavigate();
  const gotoJava = () => {
    history(`/dashboard/java/${JAVA_INFO.folderId}/${JAVA_INFO.name}`);
  };

  return (
    <RootStyle>
      <IconWrapperStyle>
        <IconButton>
          <Icon icon={javaIcon} width={24} height={24} onClick={gotoJava} />
        </IconButton>
      </IconWrapperStyle>
      {/* <Typography variant="h3">{fShortenNumber(TOTAL)}</Typography> */}
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }} onClick={gotoJava}>
        Java Materials
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {java_name}
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
