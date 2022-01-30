import React from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "src/authentication/AuthContext";
import { addOneInterviewSignUp } from "src/mysql_db_api/members";
import { ProfessionalsTab } from "src/components/_dashboard/professionals";
import { Container, Grid } from "@material-ui/core";
import handshakeIcon from "@iconify/icons-fa-regular/handshake";
import fileSearchAlt from "@iconify/icons-uil/file-search-alt";
import InputAdornments from "./Profile";

export default function Professionals() {
  const { userProfile, isResume } = useAuth();
  const psid = userProfile.psid;
  // console.log("linkedin", userProfile.linkedin_link);
  const canSignupResumeReview = isResume;
  const professionals_tab_info = [
    {
      name: "Schedule Home Inspection",
      func: async () => await addOneInterviewSignUp(psid),
      icon: fileSearchAlt,
      color: 2, // color code
      canSignup: true,
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
      <InputAdornments />
      <div style={{ paddingBottom: "75px", paddingTop: "25px" }}>
        <h2
          style={{
            padding: "12px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <br />
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
          ></div>
        </h2>
      </div>
    </Container>
  );
}
