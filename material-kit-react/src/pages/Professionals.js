import React from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "src/authentication/AuthContext";
import {
  addOneInterviewSignUp,
  addOneLinkedinSignUp,
  addOneResumeSignUp,
} from "src/mysql_db_api/members";
import { ProfessionalsTab } from "src/components/_dashboard/professionals";
import { Container, Grid } from "@material-ui/core";
import handshakeIcon from "@iconify/icons-fa-regular/handshake";
import documentSentiment from "@iconify/icons-carbon/document-sentiment";
import linkedinOutlined from "@iconify/icons-ant-design/linkedin-outlined";

const pd_name = process.env.REACT_APP_PD_NAME;
const pd_linkedin = process.env.REACT_APP_PD_LINKEDIN;
const pd_email = process.env.REACT_APP_PD_EMAIL;

export default function Professionals() {
  const { userProfile, isResume } = useAuth();
  const psid = userProfile.psid;
  // console.log("linkedin", userProfile.linkedin_link);
  const canSignupLinkedinReview =
    userProfile.linkedin_link.includes("linkedin.com");
  const canSignupResumeReview = isResume;
  const professionals_tab_info = [
    {
      name: "Mock Interview",
      func: async () => await addOneInterviewSignUp(psid),
      icon: handshakeIcon,
      color: 0, // color code
      canSignup: true,
    },
    {
      name: "Resume Review",
      func: async () => await addOneResumeSignUp(psid),
      icon: documentSentiment,
      color: 2, // color code
      canSignup: canSignupResumeReview,
    },
    {
      name: "Linkedin Review",
      func: async () => await addOneLinkedinSignUp(psid),
      icon: linkedinOutlined,
      color: 1, // color code
      canSignup: canSignupLinkedinReview,
    },
  ];

  function openLinkedIn() {
    window.open(pd_linkedin, "_blank");
  }

  function openEmail() {
    window.open(pd_email);
  }

  return (
    <Container>
      <Grid container spacing={3}>
        {professionals_tab_info.map((item) => {
          return (
            <Grid key={item.name} item xs={12} sm={6} md={4}>
              <ProfessionalsTab
                name={item.name}
                signUpFunc={item.func}
                color={item.color}
                icon={item.icon}
                canSignup={item.canSignup}
              />
            </Grid>
          );
        })}
      </Grid>
      <div style={{ paddingBottom: "75px", paddingTop: "25px" }}>
        <h3
          style={{
            padding: "12px",
            backgroundColor: "#EBF0F5",
            borderRadius: "12px",
            textAlign: "center",
            fontSize: "25px",
          }}
        >
          Professional Development Officer
        </h3>
        <h2
          style={{
            padding: "12px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {pd_name}
          <br />
          <Icon
            icon="carbon:logo-linkedin"
            onClick={openLinkedIn}
            cursor={"pointer"}
            fontSize={"30px"}
          />
          <Icon
            icon="ic:baseline-email"
            onClick={openEmail}
            cursor={"pointer"}
            fontSize={"30px"}
          />
          <div
            style={{
              display: "flex",
              alignSelf: "center",
              justifyContent: "center",
              // position: "absolute",
              // top: "10px",
              // left: 0,
              // right: 0,
              // marginLeft: "auto",
              // marginRight: "auto",
              // zIndex: "-1",

            }}
          >
            <img
              src="https://misso.org/wp-content/uploads/2022/01/tony-scaled.jpg"
              style={{
                borderRadius: "60px",
                width: "500px",
                boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
              }}
            />
          </div>
        </h2>

        {/* https://misso.org/wp-content/uploads/2022/01/tony-scaled.jpg */}
      </div>
    </Container>
  );
}
